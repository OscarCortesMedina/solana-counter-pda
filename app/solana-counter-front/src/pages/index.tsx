import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import React, { useContext, useEffect, useState } from 'react';
import { ConnectionContext, useAnchorWallet } from '@solana/wallet-adapter-react';
import { Address, AnchorProvider, Program, web3 } from '@project-serum/anchor';
import idl from '../idl.json';
import { WalletModalContext } from '@solana/wallet-adapter-react-ui';

const WalletMultiButtonDynamic = dynamic(
    async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
    { ssr: false }
);

const Home: NextPage = () => {

    const {connection} = useContext(ConnectionContext);
    const [ initialize, setInitialize ] = useState(false);
    const [ showCounter, setShowCounter ] = useState(false);
    const [ counterValue, setCounterValue ] = useState(0);
    const [count, setCount] = useState(0);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    useContext(WalletModalContext);
    const wallet= useAnchorWallet();
    const [escrowPDA,setEscrowPda] = useState<Address>();


    useEffect(() => {
        setInitialize(wallet ? true : false);
        if(wallet) {
            initSolanaRCP(getCounterPda);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[ wallet ]);

    async function getCounterPda(program: Program) {
        if (!wallet) throw new Error('wallet is null');
        const [counterPda] = web3.PublicKey.findProgramAddressSync(
            [Buffer.from("escrow"), wallet.publicKey.toBuffer()],
            program.programId);
        setEscrowPda(counterPda);
       try{
            const account:any=await program.account.escrowAccount.fetch(counterPda);
            setShowCounter(true);
            setCounterValue(account.counter);
            setCount(account.counter);
        } catch(e:any) {
            console.error("Account does not exist");
            setShowCounter(false);
            setCounterValue(0);
            setCount(0);
        }
    }

    function getProvider() {
        if (!wallet) throw new Error('wallet is null');
        // link to the network
        const provider = new AnchorProvider(connection, wallet, {
            preflightCommitment: 'confirmed',
            commitment: 'confirmed',
        });
        if (!provider) throw new Error('provider is null');
        return provider;
    }

    async function sonalaRcpHandler(rcpMethod: Function) {
        setError("");
        setLoading(true);
        const account:any = await initSolanaRCP(rcpMethod);
        if(account){
            setCounterValue(account.counter);
            setCount(account.counter);
        }
        setLoading(false);
    }

    async function initSolanaRCP(rcpMethod: Function) {
        
        const provider = getProvider();
        const idlObject = JSON.parse(JSON.stringify(idl)); 
        const program = new Program(idlObject,idlObject.metadata.address,provider);
        try {
            await rcpMethod(program);
            if(escrowPDA) {
                return await program.account.escrowAccount.fetch(escrowPDA);
            }
         }catch(e:any) {
            if(e.errorLogs) {
                setError(JSON.stringify(e.errorLogs[0]))
            } else if(!JSON.stringify(e).indexOf("Account does not exist")){
                setError("An error occur while trying to execute the transaction: "+JSON.stringify(e));
            }else {
                console.error("Account does not exist");
            }
        }

    }

    async function initializeCounter(program:Program) {
        await program.methods
        .createEscrowCounter()
        .accounts({
            signer: wallet?.publicKey,
            systemProgram: web3.SystemProgram.programId,
            counterPda: escrowPDA,
        })
        .rpc();

    }

    async function incrementCounter(program:Program)  {
        if(count==254){
            setError("Counter value must be less than 255")
        } else {
            await program.methods
            .increment()
            .accounts({
                systemProgram: web3.SystemProgram.programId,
                counterPda: escrowPDA,
            })
            .rpc();
        }

    }

    async function decrementCounter(program:Program)  {
        if(count==0){
            setError("Counter value must be greater than 0")
        } else {
        await program.methods
            .decrement()
            .accounts({
                systemProgram: web3.SystemProgram.programId,
                counterPda: escrowPDA,
            })
            .rpc();
        }

    }

    async function setCounter(program:Program)  {

        if(counterValue>=255){
            setError("Counter value must be less than 255")
        }else if(counterValue<0){
            setError("Counter value must be greater than 0")
        } else {
            await program.methods
            .setCounter(counterValue)
            .accounts({
                systemProgram: web3.SystemProgram.programId,
                counterPda: escrowPDA,
            })
            .rpc();
        }
        
    }

    return (
        <div >
            <Head>
                <title>Doge Capital Solana Counter</title>
                <meta name="counter" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className="bg-indigo-500 flex min-h-screen items-center justify-center relative">

                <div className={(loading? 'animate-pulse':'')+" flex items-center justify-center h-screen px-2"}>
                <div className="bg-white p-8 rounded shadow-lg">
                    <h2 className="text-2xl font-bold mb-4">Doge Capital Solana counter <br/>(devnet)</h2>

                    {showCounter && <>
                    <h2 className="text-2xl font-bold mb-4">Counter: {count}</h2>
                    <div className="mt-4 grid grid-cols-2 gap-1">
                        <input className="border p-2 w-full" type="number" 
                        placeholder="Set counter..." value={counterValue} onChange={(event) => setCounterValue(Number(event.target.value))}  />
                        <button className="bg-green-500 text-white py-2 px-4 rounded" 
                        onClick={()=>sonalaRcpHandler(setCounter)}>Set</button>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-1">
                        <button className="bg-red-500 text-white py-2 px-4 rounded" 
                            onClick={()=>sonalaRcpHandler(decrementCounter)}>Decrement</button>
                        <button className="bg-green-500 text-white py-2 px-4 rounded" 
                            onClick={()=>sonalaRcpHandler(incrementCounter)}>Increment</button>
                    </div>
                    {error && <p className="text-red-300 mt-2 max-w-xs">{error}</p>}
                    </>}
                    { initialize && !showCounter && 
                    <button className="bg-green-500 text-white py-2 px-4 rounded"  
                    onClick={()=>sonalaRcpHandler(initializeCounter)}>Initialize counter</button>}
                    <div className="mt-4 grid grid-cols-2 gap-1">
                    <WalletMultiButtonDynamic />
                    </div>
                </div>
                </div>

            </main>
        </div>
    );
};

export default Home;
