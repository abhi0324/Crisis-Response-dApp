import { NextResponse } from 'next/server';
import { Web3Storage, File as Web3File } from 'web3.storage';
import { NFTStorage, File as NFTFile } from 'nft.storage';

export const runtime = 'nodejs';

// Initialize storage clients
const getWeb3StorageClient = () => {
  const token = process.env.WEB3_STORAGE_TOKEN;
  if (!token) {
    console.log('WEB3_STORAGE_TOKEN not configured');
    return null;
  }
  try {
    return new Web3Storage({ token });
  } catch (error) {
    console.error('Failed to initialize Web3Storage client:', error);
    return null;
  }
};

const getNFTStorageClient = () => {
  const token = process.env.NFT_STORAGE_TOKEN;
  if (!token) {
    console.log('NFT_STORAGE_TOKEN not configured');
    return null;
  }
  try {
    return new NFTStorage({ token });
  } catch (error) {
    console.error('Failed to initialize NFTStorage client:', error);
    return null;
  }
};

export async function POST(request) {
  try {
    console.log('IPFS upload request received');
    
    const formData = await request.formData();
    const file = formData.get('file');
    const jsonData = formData.get('json');
    
    if (!file && !jsonData) {
      console.log('No file or JSON data provided');
      return NextResponse.json({ error: 'No file or JSON data provided' }, { status: 400 });
    }

    let cid = null;
    let error = null;
    let uploadMethod = '';

    if (file) {
      // Handle file upload
      console.log('Processing file upload:', file.name, file.type, file.size);
      
      const buffer = await file.arrayBuffer();
      const fileName = file.name || 'uploaded-file';
      
      // Try Web3.Storage first
      const web3Client = getWeb3StorageClient();
      if (web3Client) {
        try {
          console.log('Attempting Web3.Storage upload...');
          const web3File = new Web3File([buffer], fileName);
          cid = await web3Client.put([web3File]);
          uploadMethod = 'Web3.Storage';
          console.log('Successfully uploaded to Web3.Storage:', cid);
        } catch (err) {
          console.error('Web3.Storage upload failed:', err);
          error = err.message;
        }
      }

      // If Web3.Storage failed or not available, try NFT.Storage
      if (!cid) {
        const nftClient = getNFTStorageClient();
        if (nftClient) {
          try {
            console.log('Attempting NFT.Storage upload...');
            const nftFile = new NFTFile([buffer], fileName);
            cid = await nftClient.storeBlob(nftFile);
            uploadMethod = 'NFT.Storage';
            console.log('Successfully uploaded to NFT.Storage:', cid);
          } catch (err) {
            console.error('NFT.Storage upload failed:', err);
            error = err.message;
          }
        }
      }
    } else if (jsonData) {
      // Handle JSON upload
      console.log('Processing JSON upload');
      
      try {
        const jsonString = jsonData.toString();
        const jsonBuffer = Buffer.from(jsonString, 'utf-8');
        
        // Try Web3.Storage first
        const web3Client = getWeb3StorageClient();
        if (web3Client) {
          try {
            console.log('Attempting Web3.Storage JSON upload...');
            const web3File = new Web3File([jsonBuffer], 'metadata.json');
            cid = await web3Client.put([web3File]);
            uploadMethod = 'Web3.Storage';
            console.log('Successfully uploaded JSON to Web3.Storage:', cid);
          } catch (err) {
            console.error('Web3.Storage JSON upload failed:', err);
            error = err.message;
          }
        }

        // If Web3.Storage failed or not available, try NFT.Storage
        if (!cid) {
          const nftClient = getNFTStorageClient();
          if (nftClient) {
            try {
              console.log('Attempting NFT.Storage JSON upload...');
              const nftFile = new NFTFile([jsonBuffer], 'metadata.json');
              cid = await nftClient.storeBlob(nftFile);
              uploadMethod = 'NFT.Storage';
              console.log('Successfully uploaded JSON to NFT.Storage:', cid);
            } catch (err) {
              console.error('NFT.Storage JSON upload failed:', err);
              error = err.message;
            }
          }
        }
      } catch (err) {
        console.error('JSON processing failed:', err);
        error = err.message;
      }
    }

    // If both failed, return error
    if (!cid) {
      const errorMessage = error || 'No IPFS storage providers configured';
      console.error('All IPFS upload methods failed:', errorMessage);
      
      // Check if tokens are configured
      const hasWeb3Token = !!process.env.WEB3_STORAGE_TOKEN;
      const hasNFTToken = !!process.env.NFT_STORAGE_TOKEN;
      
      let configMessage = '';
      if (!hasWeb3Token && !hasNFTToken) {
        configMessage = 'Please configure WEB3_STORAGE_TOKEN or NFT_STORAGE_TOKEN in your .env.local file';
      } else if (hasWeb3Token && !hasNFTToken) {
        configMessage = 'Web3.Storage token is configured but upload failed. Please check the token validity.';
      } else if (!hasWeb3Token && hasNFTToken) {
        configMessage = 'NFT.Storage token is configured but upload failed. Please check the token validity.';
      } else {
        configMessage = 'Both tokens are configured but uploads failed. Please check token validity and network connectivity.';
      }
      
      return NextResponse.json({ 
        error: errorMessage,
        message: configMessage,
        tokensConfigured: { web3: hasWeb3Token, nft: hasNFTToken }
      }, { status: 500 });
    }

    console.log(`Upload successful via ${uploadMethod}:`, cid);
    
    return NextResponse.json({ 
      cid,
      url: `https://ipfs.io/ipfs/${cid}`,
      method: uploadMethod,
      message: 'File uploaded successfully'
    });

  } catch (error) {
    console.error('IPFS upload error:', error);
    return NextResponse.json({ 
      error: 'Failed to upload file',
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}
