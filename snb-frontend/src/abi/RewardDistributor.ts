const RewardDistributorAbi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "referrer",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint8",
        name: "level",
        type: "uint8",
      },
    ],
    name: "ReferralReward",
    type: "event",
  },
] as const;

export default RewardDistributorAbi;
