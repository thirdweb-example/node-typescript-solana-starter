import { config } from "dotenv";
import { Network, ThirdwebSDK } from "@thirdweb-dev/sdk/solana";
import { readFileSync } from "fs";

config();

const network: Network = "devnet";

const main = async () => {
  if (!process.env.PRIVATE_KEY) {
    throw new Error("No private key found");
  }
  try {
    const sdk = ThirdwebSDK.fromPrivateKey(
      network,
      process.env.PRIVATE_KEY as string
    );

    console.log("Logged in as", sdk.wallet.getAddress());
    console.log("Balance", await sdk.wallet.getBalance());

    const programAddress = await sdk.deployer.createNftDrop({
      name: "My Drop",
      totalSupply: 3,
      description: "My stars NFT Drop",
    });

    console.log("Program address: ", programAddress);

    const program = await sdk.getNFTDrop(programAddress);

    const metadatas = [
      {
        name: "Blue Star",
        description: "A blue star NFT",
        image: readFileSync("assets/blue-star.png"),
      },
      {
        name: "Red Star",
        description: "A red star NFT",
        image: readFileSync("assets/red-star.png"),
      },
      {
        name: "Yellow Star",
        description: "A yellow star NFT",
        image: readFileSync("assets/yellow-star.png"),
      },
    ];

    await program.lazyMint(metadatas);
    console.log("Created batch successfully!");
  } catch (e) {
    console.error("Something went wrong: ", e);
  }
};

main();
