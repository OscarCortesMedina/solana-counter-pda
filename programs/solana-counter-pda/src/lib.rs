use anchor_lang::prelude::*;
use std::mem::size_of;

declare_id!("7svgaB3eLuznUxY4TVSGniymThy4mUCspCnCdkEpCg1T");

#[program]
pub mod solana_counter_pda {
    use super::*;

    pub fn create_escrow_counter(ctx: Context<CreateEscrowCounter>) -> Result<()> {
        let counter_pda = &mut ctx.accounts.counter_pda;
        counter_pda.signer = ctx.accounts.signer.key();
        counter_pda.counter = 0;

        Ok(())
    }

    pub fn set_counter(ctx: Context<UpdateCounter>, new_value: u8) -> Result<()> {
        let counter_pda = &mut ctx.accounts.counter_pda;

        if new_value == u8::MAX {
            return Err(ErrorCode::CounterTooLong.into());
        }
        if new_value == u8::MIN {
            return Err(ErrorCode::NegativeCounter.into());
        }
        counter_pda.counter = new_value;
        Ok(())
    }

    pub fn increment(ctx: Context<UpdateCounter>) -> Result<()> {
        let counter_pda = &mut ctx.accounts.counter_pda;

        if counter_pda.counter == u8::MAX {
            return Err(ErrorCode::CounterTooLong.into());
        }
        counter_pda.counter += 1;
        Ok(())
    }

    pub fn decrement(ctx: Context<UpdateCounter>) -> Result<()> {
        let counter_pda = &mut ctx.accounts.counter_pda;

        if counter_pda.counter == u8::MIN {
            return Err(ErrorCode::NegativeCounter.into());
        }
        counter_pda.counter -= 1;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct CreateEscrowCounter<'info> {
    #[account(
        init,
        seeds = [b"escrow".as_ref(), signer.key().as_ref()],
        bump,
        payer = signer,
        space = size_of::<EscrowAccount>() + 16
    )]
    pub counter_pda: Account<'info, EscrowAccount>,

    #[account(mut)]
    pub signer: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateCounter<'info> {
    #[account(
        mut,
        seeds = [b"escrow".as_ref(), payer.key().as_ref()],
        bump,
    )]
    counter_pda: Account<'info, EscrowAccount>,
    #[account(mut)]
    payer: Signer<'info>,
    system_program: Program<'info, System>,
}

#[account]
pub struct EscrowAccount {
    pub signer: Pubkey,
    pub counter: u8,
}

#[error_code]
pub enum ErrorCode {
    #[msg("Counter should be positive")]
    NegativeCounter,
    #[msg("Counter is too long, max value 255")]
    CounterTooLong,
}
