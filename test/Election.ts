import { expect } from "chai";
import { ethers } from "hardhat";

describe("Election", function () {
  // Define a fixture to reuse the same setup in every test
  async function deployElectionFixture() {
    const [owner, voter1, voter2] = await ethers.getSigners();

    // Deploy the Election contract
    const Election = await ethers.getContractFactory("Election");
    const election = await Election.deploy();

    return { election, owner, voter1, voter2 };
  }

  describe("Deployment", function () {
    it("Should have 2 candidates initially", async function () {
      const { election } = await deployElectionFixture();
      expect(await election.candidatesCount()).to.equal(2);
    });

    it("Should return the correct candidate names", async function () {
      const { election } = await deployElectionFixture();

      const candidate1 = await election.candidates(1);
      const candidate2 = await election.candidates(2);

      expect(candidate1.name).to.equal("Candidate 1");
      expect(candidate2.name).to.equal("Candidate 2");
    });
  });

  describe("Voting", function () {
    it("Should allow a voter to vote for a candidate", async function () {
      const { election, voter1 } = await deployElectionFixture();

      await election.connect(voter1).vote(1); // Voter votes for Candidate 1

      const candidate1 = await election.candidates(1);
      expect(candidate1.voteCount).to.equal(1);
    });

    it("Should emit a voted event on successful vote", async function () {
      const { election, voter1 } = await deployElectionFixture();

      await expect(election.connect(voter1).vote(1))
        .to.emit(election, "votedEvent")
        .withArgs(1); // Candidate ID is 1
    });

    it("Should not allow a voter to vote twice", async function () {
      const { election, voter1 } = await deployElectionFixture();

      await election.connect(voter1).vote(1); // First vote
      await expect(election.connect(voter1).vote(1)).to.be.revertedWith(
        "You have already voted"
      );
    });

    it("Should not allow voting for an invalid candidate", async function () {
      const { election, voter1 } = await deployElectionFixture();

      await expect(election.connect(voter1).vote(3)).to.be.revertedWith(
        "Invalid candidate ID"
      );
    });
  });
});
