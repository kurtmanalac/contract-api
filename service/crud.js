'use strict';

const { Contract } = require('fabric-contract-api');

class ArticleContract extends Contract {
    constructor() {
        super('ArticleContract'); // This name is used to target the contract
    }

    async AssetExists(ctx, icsNumber) {
        const assetJSON = await ctx.stub.getState(icsNumber);
        return assetJSON && assetJSON.length > 0;
    }

    /**
     * Create or Append to an Article Group
     * This handles multiple items sharing the same icsNumber.
     */
    async AddItemToArticleGroup(ctx, icsNumber, itemData, costData, ownerData) {
        let articleGroup = {
            docType: 'article_group',
            icsNumber: icsNumber,
            items: []
        };

        // Check if the group already exists
        const exists = await this.AssetExists(ctx, icsNumber);
        if (exists) {
            const existingData = await ctx.stub.getState(icsNumber);
            articleGroup = JSON.parse(existingData.toString());
        }

        // Parse incoming data
        const newItem = JSON.parse(itemData);
        const newCost = JSON.parse(costData);
        const newOwner = JSON.parse(ownerData);

        // Construct the sub-entry (the relational "row" equivalent)
        const newEntry = {
            // Article_Item details
            itemDetails: {
                department: newItem.department,
                article: newItem.article,
                description: newItem.description,
                usefulLife: newItem.usefulLife
            },

            // Article_Cost details
            costDetails: {
                qty: newCost.qty,
                unit: newCost.unit,
                unitAmount: newCost.unitAmount,
                totalAmount: newCost.totalAmount,
                salesInvoice: newCost.salesInvoice,
                dateAcquired: newCost.dateAcquired,
                dateReceived: newCost.dateReceived,
                supplier: newCost.supplier,
                fundCode: newCost.fundCode,
                itrRsWmrNumber: newCost.itrRsWmrNumber
            },

            // Article_Owner details
            ownerDetails: {
                endUser: newOwner.endUser,
                from: newOwner.from,
                qty: newOwner.qty,
                unit: newOwner.unit
            }
        };

        // Push the new record into the array
        articleGroup.items.push(newEntry);

        // Update the state with the combined array
        await ctx.stub.putState(icsNumber, Buffer.from(JSON.stringify(articleGroup)));
        return JSON.stringify(articleGroup);
    }

    // Read returns the full list of items for that ICS Number
    async ReadArticleGroup(ctx, icsNumber) {
        const assetJSON = await ctx.stub.getState(icsNumber);
        if (!assetJSON || assetJSON.length === 0) {
            throw new Error(`No items found for ICS Number ${icsNumber}`);
        }
        return assetJSON.toString();
    }

    async DeleteItem(ctx, icsNumber, itemId) {
        const groupBytes = await ctx.stub.getState(icsNumber);
        if (!groupBytes || groupBytes.length === 0) {
            throw new Error(`The group with ICS Number ${icsNumber} does not exist`);
        }

        const group = JSON.parse(groupBytes.toString());
        
        // Find the index of the specific item
        const itemIndex = group.items.findIndex(item => item.itemId === itemId);
        
        if (itemIndex === -1) {
            throw new Error(`Item with ID ${itemId} not found in group ${icsNumber}`);
        }

        // Remove the item from the array
        group.items.splice(itemIndex, 1);

        // If the group is now empty, delete the whole key from the ledger
        if (group.items.length === 0) {
            await ctx.stub.deleteState(icsNumber);
            return `Group ${icsNumber} was empty and has been deleted.`;
        }

        // Otherwise, update the ledger with the remaining items
        await ctx.stub.putState(icsNumber, Buffer.from(JSON.stringify(group)));
        return `Item ${itemId} deleted successfully from group ${icsNumber}.`;
    }

    /**
     * Delete the entire ICS Number group and all items within it
     */
    async DeleteEntireGroup(ctx, icsNumber) {
        const exists = await ctx.stub.getState(icsNumber);
        if (!exists || exists.length === 0) {
            throw new Error(`The group with ICS Number ${icsNumber} does not exist`);
        }

        await ctx.stub.deleteState(icsNumber);
        return `Entire group ${icsNumber} deleted successfully.`;
    }
}

module.exports = ArticleContract;


