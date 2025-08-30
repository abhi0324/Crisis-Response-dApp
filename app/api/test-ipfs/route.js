import { NextResponse } from 'next/server';
import { NFTStorage } from 'nft.storage';
import { Web3Storage } from 'web3.storage';

export const runtime = 'nodejs';

export async function GET() {
  try {
    console.log('Testing IPFS configuration...');
    
    // Test NFT.Storage
    const nftToken = process.env.NFT_STORAGE_TOKEN;
    const web3Token = process.env.WEB3_STORAGE_TOKEN;
    
    console.log('NFT_STORAGE_TOKEN length:', nftToken ? nftToken.length : 'Not set');
    console.log('WEB3_STORAGE_TOKEN length:', web3Token ? web3Token.length : 'Not set');
    
    let results = {
      nftStorage: { configured: false, working: false, error: null },
      web3Storage: { configured: false, working: false, error: null }
    };
    
    // Test NFT.Storage
    if (nftToken) {
      results.nftStorage.configured = true;
      try {
        const nftClient = new NFTStorage({ token: nftToken });
        // Test by trying to store a small test blob
        const testBlob = new Blob(['test'], { type: 'text/plain' });
        const cid = await nftClient.storeBlob(testBlob);
        results.nftStorage.working = true;
        console.log('NFT.Storage test successful, stored test file:', cid);
      } catch (error) {
        results.nftStorage.error = error.message;
        console.error('NFT.Storage test failed:', error.message);
      }
    }
    
    // Test Web3.Storage
    if (web3Token) {
      results.web3Storage.configured = true;
      try {
        const web3Client = new Web3Storage({ token: web3Token });
        // Test by trying to get user info
        const status = await web3Client.getStatus();
        results.web3Storage.working = true;
        console.log('Web3.Storage test successful, status:', status);
      } catch (error) {
        results.web3Storage.error = error.message;
        console.error('Web3.Storage test failed:', error.message);
      }
    }
    
    return NextResponse.json({
      message: 'IPFS configuration test completed',
      results,
      recommendations: getRecommendations(results)
    });
    
  } catch (error) {
    console.error('IPFS test error:', error);
    return NextResponse.json({ 
      error: 'Failed to test IPFS configuration',
      details: error.message 
    }, { status: 500 });
  }
}

function getRecommendations(results) {
  const recommendations = [];
  
  if (!results.nftStorage.configured && !results.web3Storage.configured) {
    recommendations.push('No IPFS tokens configured. Please add WEB3_STORAGE_TOKEN or NFT_STORAGE_TOKEN to your .env.local file');
  }
  
  if (results.nftStorage.configured && !results.nftStorage.working) {
    recommendations.push('NFT.Storage token is invalid or expired. Please get a new token from https://nft.storage/');
  }
  
  if (results.web3Storage.configured && !results.web3Storage.working) {
    recommendations.push('Web3.Storage token is invalid or expired. Please get a new token from https://web3.storage/');
  }
  
  if (results.nftStorage.working || results.web3Storage.working) {
    recommendations.push('IPFS storage is working! You can now submit reports.');
  }
  
  return recommendations;
} 