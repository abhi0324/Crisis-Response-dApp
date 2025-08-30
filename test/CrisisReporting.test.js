const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CrisisReporting", function () {
  let crisisReporting;
  let owner;
  let reporter1;
  let reporter2;
  let donor1;
  let donor2;

  beforeEach(async function () {
    [owner, reporter1, reporter2, donor1, donor2] = await ethers.getSigners();
    
    const CrisisReporting = await ethers.getContractFactory("CrisisReporting");
    crisisReporting = await CrisisReporting.deploy();
    await crisisReporting.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await crisisReporting.owner()).to.equal(owner.address);
    });

    it("Should start with zero reports and donations", async function () {
      expect(await crisisReporting.getReportsCount()).to.equal(0);
      expect(await crisisReporting.totalDonations()).to.equal(0);
    });
  });

  describe("Report Submission", function () {
    it("Should allow anyone to submit a report", async function () {
      const reportData = {
        title: "Test Crisis",
        description: "Test description",
        location: "Test location",
        imageHash: "QmTestHash",
        ipfsCID: "QmTestCID"
      };

      await crisisReporting.connect(reporter1).submitReport(
        reportData.title,
        reportData.description,
        reportData.location,
        reportData.imageHash,
        reportData.ipfsCID
      );

      const report = await crisisReporting.getReport(0);
      expect(report.title).to.equal(reportData.title);
      expect(report.description).to.equal(reportData.description);
      expect(report.location).to.equal(reportData.location);
      expect(report.imageHash).to.equal(reportData.imageHash);
      expect(report.ipfsCID).to.equal(reportData.ipfsCID);
      expect(report.reporter).to.equal(reporter1.address);
      expect(report.verified).to.equal(false);
      expect(report.verificationCount).to.equal(0);
    });

    it("Should emit ReportSubmitted event", async function () {
      const reportData = {
        title: "Test Crisis",
        description: "Test description",
        location: "Test location",
        imageHash: "QmTestHash",
        ipfsCID: "QmTestCID"
      };

      await expect(
        crisisReporting.connect(reporter1).submitReport(
          reportData.title,
          reportData.description,
          reportData.location,
          reportData.imageHash,
          reportData.ipfsCID
        )
      ).to.emit(crisisReporting, "ReportSubmitted")
        .withArgs(0, reporter1.address, reportData.title, reportData.ipfsCID);
    });

    it("Should reject empty title", async function () {
      await expect(
        crisisReporting.connect(reporter1).submitReport(
          "",
          "Test description",
          "Test location",
          "QmTestHash",
          "QmTestCID"
        )
      ).to.be.revertedWith("Title cannot be empty");
    });

    it("Should reject empty description", async function () {
      await expect(
        crisisReporting.connect(reporter1).submitReport(
          "Test Crisis",
          "",
          "Test location",
          "QmTestHash",
          "QmTestCID"
        )
      ).to.be.revertedWith("Description cannot be empty");
    });
  });

  describe("Reporter Verification", function () {
    it("Should allow owner to verify reporters", async function () {
      await crisisReporting.connect(owner).verifyReporter(reporter1.address);
      expect(await crisisReporting.verifiedReporters(reporter1.address)).to.equal(true);
    });

    it("Should emit ReporterVerified event", async function () {
      await expect(
        crisisReporting.connect(owner).verifyReporter(reporter1.address)
      ).to.emit(crisisReporting, "ReporterVerified")
        .withArgs(reporter1.address);
    });

    it("Should not allow non-owner to verify reporters", async function () {
      await expect(
        crisisReporting.connect(reporter1).verifyReporter(reporter2.address)
      ).to.be.revertedWithCustomError(crisisReporting, "OwnableUnauthorizedAccount");
    });
  });

  describe("Report Verification", function () {
    beforeEach(async function () {
      // Submit a report
      await crisisReporting.connect(reporter1).submitReport(
        "Test Crisis",
        "Test description",
        "Test location",
        "QmTestHash",
        "QmTestCID"
      );

      // Verify reporter2
      await crisisReporting.connect(owner).verifyReporter(reporter2.address);
    });

    it("Should allow verified reporters to verify reports", async function () {
      await crisisReporting.connect(reporter2).verifyReport(0);
      
      const report = await crisisReporting.getReport(0);
      expect(report.verificationCount).to.equal(1);
      expect(report.verified).to.equal(false); // Not enough verifications yet
    });

    it("Should not allow unverified reporters to verify reports", async function () {
      await expect(
        crisisReporting.connect(donor1).verifyReport(0)
      ).to.be.revertedWith("Only verified reporters can perform this action");
    });

    it("Should not allow reporters to verify their own reports", async function () {
      await crisisReporting.connect(owner).verifyReporter(reporter1.address);
      
      await expect(
        crisisReporting.connect(reporter1).verifyReport(0)
      ).to.be.revertedWith("Cannot verify your own report");
    });

    it("Should not allow double verification", async function () {
      await crisisReporting.connect(reporter2).verifyReport(0);
      
      await expect(
        crisisReporting.connect(reporter2).verifyReport(0)
      ).to.be.revertedWith("Already verified this report");
    });

    it("Should mark report as verified after threshold", async function () {
      // Verify reporter3
      await crisisReporting.connect(owner).verifyReporter(donor1.address);
      
      // Verify reporter4
      await crisisReporting.connect(owner).verifyReporter(donor2.address);

      // Get 3 verifications
      await crisisReporting.connect(reporter2).verifyReport(0);
      await crisisReporting.connect(donor1).verifyReport(0);
      await crisisReporting.connect(donor2).verifyReport(0);

      const report = await crisisReporting.getReport(0);
      expect(report.verificationCount).to.equal(3);
      expect(report.verified).to.equal(true);
    });
  });

  describe("Donations", function () {
    it("Should accept donations", async function () {
      const donationAmount = ethers.parseEther("1.0");
      
      await crisisReporting.connect(donor1).donate("Test donation", { value: donationAmount });
      
      expect(await crisisReporting.totalDonations()).to.equal(donationAmount);
    });

    it("Should emit DonationReceived event", async function () {
      const donationAmount = ethers.parseEther("0.5");
      
      await expect(
        crisisReporting.connect(donor1).donate("Test donation", { value: donationAmount })
      ).to.emit(crisisReporting, "DonationReceived")
        .withArgs(donor1.address, donationAmount, "Test donation");
    });

    it("Should reject zero donations", async function () {
      await expect(
        crisisReporting.connect(donor1).donate("Test donation", { value: 0 })
      ).to.be.revertedWith("Donation amount must be greater than 0");
    });

    it("Should track multiple donations", async function () {
      const donation1 = ethers.parseEther("1.0");
      const donation2 = ethers.parseEther("0.5");
      
      await crisisReporting.connect(donor1).donate("First donation", { value: donation1 });
      await crisisReporting.connect(donor2).donate("Second donation", { value: donation2 });
      
      expect(await crisisReporting.totalDonations()).to.equal(donation1 + donation2);
    });
  });

  describe("Withdrawals", function () {
    it("Should allow owner to withdraw donations", async function () {
      const donationAmount = ethers.parseEther("1.0");
      await crisisReporting.connect(donor1).donate("Test donation", { value: donationAmount });
      
      const initialBalance = await ethers.provider.getBalance(owner.address);
      await crisisReporting.connect(owner).withdrawDonations();
      const finalBalance = await ethers.provider.getBalance(owner.address);
      
      expect(finalBalance).to.be.gt(initialBalance);
    });

    it("Should not allow non-owner to withdraw", async function () {
      await expect(
        crisisReporting.connect(donor1).withdrawDonations()
      ).to.be.revertedWithCustomError(crisisReporting, "OwnableUnauthorizedAccount");
    });

    it("Should reject withdrawal when no funds", async function () {
      await expect(
        crisisReporting.connect(owner).withdrawDonations()
      ).to.be.revertedWith("No funds to withdraw");
    });
  });

  describe("Data Retrieval", function () {
    beforeEach(async function () {
      // Submit reports
      await crisisReporting.connect(reporter1).submitReport(
        "Report 1",
        "Description 1",
        "Location 1",
        "QmHash1",
        "QmCID1"
      );
      
      await crisisReporting.connect(reporter2).submitReport(
        "Report 2",
        "Description 2",
        "Location 2",
        "QmHash2",
        "QmCID2"
      );

      // Make donations
      await crisisReporting.connect(donor1).donate("Donation 1", { value: ethers.parseEther("1.0") });
      await crisisReporting.connect(donor2).donate("Donation 2", { value: ethers.parseEther("0.5") });
    });

    it("Should return all reports", async function () {
      const reports = await crisisReporting.getAllReports();
      expect(reports.length).to.equal(2);
      expect(reports[0].title).to.equal("Report 1");
      expect(reports[1].title).to.equal("Report 2");
    });

    it("Should return all donations", async function () {
      const donations = await crisisReporting.getAllDonations();
      expect(donations.length).to.equal(2);
      expect(donations[0].donor).to.equal(donor1.address);
      expect(donations[1].donor).to.equal(donor2.address);
    });

    it("Should return reporter reports", async function () {
      const reporterReports = await crisisReporting.getReporterReports(reporter1.address);
      expect(reporterReports.length).to.equal(1);
      expect(reporterReports[0]).to.equal(0);
    });

    it("Should return donor donations", async function () {
      const donorDonations = await crisisReporting.getDonorDonations(donor1.address);
      expect(donorDonations.length).to.equal(1);
      expect(donorDonations[0]).to.equal(0);
    });
  });
}); 