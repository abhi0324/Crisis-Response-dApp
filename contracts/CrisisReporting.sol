// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CrisisReporting is ReentrancyGuard, Ownable {
    
    struct Report {
        string title;
        string description;
        string location;
        string imageHash;
        string ipfsCID;
        address reporter;
        uint256 timestamp;
        bool verified;
        uint256 verificationCount;
    }
    
    struct Donation {
        address donor;
        uint256 amount;
        uint256 timestamp;
        string message;
    }
    
    Report[] public reports;
    Donation[] public donations;
    
    mapping(address => uint256[]) public reporterReports;
    mapping(address => uint256[]) public donorDonations;
    mapping(address => bool) public verifiedReporters;
    mapping(uint256 => mapping(address => bool)) public reportVerifications;
    
    uint256 public totalDonations;
    uint256 public totalReports;
    uint256 public verificationThreshold = 3;
    
    event ReportSubmitted(uint256 reportId, address reporter, string title, string ipfsCID);
    event ReportVerified(uint256 reportId, address verifier);
    event DonationReceived(address donor, uint256 amount, string message);
    event ReporterVerified(address reporter);
    
    modifier onlyVerifiedReporter() {
        require(verifiedReporters[msg.sender], "Only verified reporters can perform this action");
        _;
    }
    
    function submitReport(
        string memory _title,
        string memory _description,
        string memory _location,
        string memory _imageHash,
        string memory _ipfsCID
    ) external {
        require(bytes(_title).length > 0, "Title cannot be empty");
        require(bytes(_description).length > 0, "Description cannot be empty");
        require(bytes(_location).length > 0, "Location cannot be empty");
        require(bytes(_ipfsCID).length > 0, "IPFS CID cannot be empty");
        
        Report memory newReport = Report({
            title: _title,
            description: _description,
            location: _location,
            imageHash: _imageHash,
            ipfsCID: _ipfsCID,
            reporter: msg.sender,
            timestamp: block.timestamp,
            verified: false,
            verificationCount: 0
        });
        
        reports.push(newReport);
        uint256 reportId = reports.length - 1;
        reporterReports[msg.sender].push(reportId);
        totalReports++;
        
        emit ReportSubmitted(reportId, msg.sender, _title, _ipfsCID);
    }
    
    function verifyReport(uint256 _reportId) external onlyVerifiedReporter {
        require(_reportId < reports.length, "Report does not exist");
        require(!reportVerifications[_reportId][msg.sender], "Already verified this report");
        require(reports[_reportId].reporter != msg.sender, "Cannot verify your own report");
        
        reportVerifications[_reportId][msg.sender] = true;
        reports[_reportId].verificationCount++;
        
        if (reports[_reportId].verificationCount >= verificationThreshold) {
            reports[_reportId].verified = true;
        }
        
        emit ReportVerified(_reportId, msg.sender);
    }
    
    function donate(string memory _message) external payable nonReentrant {
        require(msg.value > 0, "Donation amount must be greater than 0");
        
        Donation memory newDonation = Donation({
            donor: msg.sender,
            amount: msg.value,
            timestamp: block.timestamp,
            message: _message
        });
        
        donations.push(newDonation);
        donorDonations[msg.sender].push(donations.length - 1);
        totalDonations += msg.value;
        
        emit DonationReceived(msg.sender, msg.value, _message);
    }
    
    function verifyReporter(address _reporter) external onlyOwner {
        verifiedReporters[_reporter] = true;
        emit ReporterVerified(_reporter);
    }
    
    function withdrawDonations() external onlyOwner nonReentrant {
        uint256 amount = address(this).balance;
        require(amount > 0, "No funds to withdraw");
        
        (bool success, ) = payable(owner()).call{value: amount}("");
        require(success, "Transfer failed");
    }
    
    function getReport(uint256 _reportId) external view returns (Report memory) {
        require(_reportId < reports.length, "Report does not exist");
        return reports[_reportId];
    }
    
    function getDonation(uint256 _donationId) external view returns (Donation memory) {
        require(_donationId < donations.length, "Donation does not exist");
        return donations[_donationId];
    }
    
    function getReporterReports(address _reporter) external view returns (uint256[] memory) {
        return reporterReports[_reporter];
    }
    
    function getDonorDonations(address _donor) external view returns (uint256[] memory) {
        return donorDonations[_donor];
    }
    
    function getAllReports() external view returns (Report[] memory) {
        return reports;
    }
    
    function getAllDonations() external view returns (Donation[] memory) {
        return donations;
    }
    
    function getReportsCount() external view returns (uint256) {
        return reports.length;
    }
    
    function getDonationsCount() external view returns (uint256) {
        return donations.length;
    }
    
    function setVerificationThreshold(uint256 _threshold) external onlyOwner {
        verificationThreshold = _threshold;
    }
} 