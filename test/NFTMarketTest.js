const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NFTMarket", function () {
  it("Should create and execute market sales", async function () {
    const Market = await ethers.getContractFactory("NFTMarket")
    const market = await Market.deploy()
    await market.deployed()
    const marketAddress = market.address

    const NFT = await ethers.getContractFactory("NFT")
    const nft = await NFT.deploy(marketAddress)
    await nft.deployed()
    const nftContractAddress = nft.address

    let listingPrice = await market.getListingPrice()
    listingPrice = listingPrice.toString()

    const auctionPrice = ethers.utils.parseUnits('100', 'ether')

    await nft.createToken("https://gateway.pinata.cloud/ipfs/QmXEAQZ1aFcgD92SN6qDTC8WUrPe7r6ieVdExxETZjhE2i?preview=1")
    await nft.createToken("https://gateway.pinata.cloud/ipfs/QmRaZb5nEGiQf7b8GuPDt87bzFTzmg7frznrmzZy7XUa6p?preview=1")

    // list the nfts for sale on the market place
    await market.createMarketItem(nftContractAddress, 1, auctionPrice, { value: listingPrice})
    await market.createMarketItem(nftContractAddress, 2, auctionPrice, { value: listingPrice})

    // get a new address to represent the buyer
    const [_, buyerAddress] = await ethers.getSigners()
    // connect with this new address and purchase the nft with tokenId 1
    await market.connect(buyerAddress).createMarketSale(nftContractAddress, 1, {value: auctionPrice})

    // test item fetch
    let items = await market.fetchUnsoldMarketItems()

    items = await Promise.all(items.map(async i => {
      const tokenUri = await nft.tokenURI(i.tokenId)
      let item = {
        price: i.price.toString(),
        tokenId: i.tokenId.toString(),
        seller: i.seller,
        owner: i.owner,
        tokenUri
      }
      return item
    }))

    console.log('items: ', items)
    

  });
});
