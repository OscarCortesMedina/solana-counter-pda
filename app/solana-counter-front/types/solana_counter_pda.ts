export type SolanaCounterPda = {
  "version": "0.1.0",
  "name": "solana_counter_pda",
  "instructions": [
    {
      "name": "createEscrowCounter",
      "accounts": [
        {
          "name": "counterPda",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [],
      "returns": null
    },
    {
      "name": "setCounter",
      "accounts": [
        {
          "name": "counterPda",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "newValue",
          "type": "u8"
        }
      ],
      "returns": null
    },
    {
      "name": "increment",
      "accounts": [
        {
          "name": "counterPda",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [],
      "returns": null
    },
    {
      "name": "decrement",
      "accounts": [
        {
          "name": "counterPda",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [],
      "returns": null
    }
  ],
  "accounts": [
    {
      "name": "escrowAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "signer",
            "type": "publicKey"
          },
          {
            "name": "counter",
            "type": "u8"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "NegativeCounter",
      "msg": "Counter should be positive"
    },
    {
      "code": 6001,
      "name": "CounterTooLong",
      "msg": "Counter is too long, max value 255"
    }
  ]
};

export const IDL: SolanaCounterPda = {
  "version": "0.1.0",
  "name": "solana_counter_pda",
  "instructions": [
    {
      "name": "createEscrowCounter",
      "accounts": [
        {
          "name": "counterPda",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [],
      "returns": null
    },
    {
      "name": "setCounter",
      "accounts": [
        {
          "name": "counterPda",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "newValue",
          "type": "u8"
        }
      ],
      "returns": null
    },
    {
      "name": "increment",
      "accounts": [
        {
          "name": "counterPda",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [],
      "returns": null
    },
    {
      "name": "decrement",
      "accounts": [
        {
          "name": "counterPda",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [],
      "returns": null
    }
  ],
  "accounts": [
    {
      "name": "escrowAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "signer",
            "type": "publicKey"
          },
          {
            "name": "counter",
            "type": "u8"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "NegativeCounter",
      "msg": "Counter should be positive"
    },
    {
      "code": 6001,
      "name": "CounterTooLong",
      "msg": "Counter is too long, max value 255"
    }
  ]
};
