// IPFS Gateway URL utility
export const getIPFSGatewayURL = (cid) => {
  return `https://ipfs.io/ipfs/${cid}`;
};

// Alternative gateways for redundancy
export const getIPFSGatewayURLs = (cid) => {
  return {
    primary: `https://ipfs.io/ipfs/${cid}`,
    cloudflare: `https://cloudflare-ipfs.com/ipfs/${cid}`,
    dweb: `https://dweb.link/ipfs/${cid}`,
    gateway: `https://gateway.pinata.cloud/ipfs/${cid}`
  };
}; 