import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { utf8 } from "@project-serum/anchor/dist/cjs/utils/bytes";
import { assert } from "chai";
import { SolanaCounterPda } from "../target/types/solana_counter_pda";

describe("demo-pda", () => {
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace
    .SolanaCounterPda as Program<SolanaCounterPda>;
  const publicKey = anchor.AnchorProvider.local().wallet.publicKey;
  const [escrowPDA] = anchor.web3.PublicKey.findProgramAddressSync(
    [utf8.encode("escrow"), publicKey.toBuffer()],
    program.programId
  );
  console.log("escrowPDA", escrowPDA);
  it("Is initialized!", async () => {
    await program.methods
      .createEscrowCounter()
      .accounts({
        signer: publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
        counterPda: escrowPDA,
      })
      .rpc();
    const escrowAccount = await program.account.escrowAccount.fetch(escrowPDA);
    console.log(escrowAccount);
    assert.equal(escrowAccount.counter, 0);
    assert.isTrue(escrowAccount.signer.equals(publicKey));
  });

  it("Is modified!", async () => {
    await program.methods
      .setCounter(69)
      .accounts({
        systemProgram: anchor.web3.SystemProgram.programId,
        counterPda: escrowPDA,
      })
      .rpc();
    const escrowAccount = await program.account.escrowAccount.fetch(escrowPDA);
    console.log(escrowAccount);
    assert.equal(escrowAccount.counter, 69);
    assert.isTrue(escrowAccount.signer.equals(publicKey));
  });

  it("Is increased!", async () => {
    await program.methods
      .increment()
      .accounts({
        systemProgram: anchor.web3.SystemProgram.programId,
        counterPda: escrowPDA,
      })
      .rpc();
    const escrowAccount = await program.account.escrowAccount.fetch(escrowPDA);
    console.log(escrowAccount);
    assert.equal(escrowAccount.counter, 70);
    assert.isTrue(escrowAccount.signer.equals(publicKey));
  });

  it("Is decreased!", async () => {
    await program.methods
      .decrement()
      .accounts({
        systemProgram: anchor.web3.SystemProgram.programId,
        counterPda: escrowPDA,
      })
      .rpc();
    const escrowAccount = await program.account.escrowAccount.fetch(escrowPDA);
    console.log(escrowAccount);
    assert.equal(escrowAccount.counter, 69);
    assert.isTrue(escrowAccount.signer.equals(publicKey));
  });
});
