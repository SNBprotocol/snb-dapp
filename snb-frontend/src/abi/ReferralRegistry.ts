const ReferralRegistryAbi = [
  // ===== Write =====
  {
    inputs: [
      {
        internalType: "address",
        name: "referrer",
        type: "address",
      },
    ],
    name: "setReferrer",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },

  // ===== Read =====
  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
    ],
    name: "getReferrer",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },

  {
    inputs: [
      {
        internalType: "address",
        name: "referrer",
        type: "address",
      },
    ],
    name: "getDirectReferrals", // ✅ 修正
    outputs: [
      {
        internalType: "address[]",
        name: "",
        type: "address[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },

  // ===== Events =====
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "referrer",
        type: "address",
      },
    ],
    name: "ReferrerBound",
    type: "event",
  },
] as const;

export default ReferralRegistryAbi;
