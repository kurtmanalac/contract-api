'use strict';

const { Contract } = require('fabric-contract-api');

class ArticleContract extends Contract {

    // --- HELPER ---
    async _getGroup(ctx, icsNumber) {
        const data = await ctx.stub.getState(icsNumber);
        if (!data || data.length === 0) {
            throw new Error(`Group ${icsNumber} not found`);
        }
        return JSON.parse(data.toString());
    }

    // --- CREATE / APPEND ---
    async AddItem(ctx, icsNumber, itemDataJson) {
        let group;
        const exists = await ctx.stub.getState(icsNumber);
        
        if (!exists || exists.length === 0) {
            group = { docType: 'article_group', icsNumber, items: [] };
        } else {
            group = JSON.parse(exists.toString());
        }

        const newItem = JSON.parse(itemDataJson);
        // Assign a unique sub-ID or timestamp to identify this specific item in the array
        newItem.itemId = Date.now().toString(); 
        
        group.items.push(newItem);
        await ctx.stub.putState(icsNumber, Buffer.from(JSON.stringify(group)));
        return JSON.stringify(newItem);
    }

    // --- READ ---
    async ReadGroup(ctx, icsNumber) {
        const group = await this._getGroup(ctx, icsNumber);
        return JSON.stringify(group);
    }

    // --- UPDATE ---
    async UpdateItemInGroup(ctx, icsNumber, itemId, updatedFieldsJson) {
        const group = await this._getGroup(ctx, icsNumber);
        const updates = JSON.parse(updatedFieldsJson);
        
        const itemIndex = group.items.findIndex(item => item.itemId === itemId);
        if (itemIndex === -1) {
            throw new Error(`Item ${itemId} not found in group ${icsNumber}`);
        }

        // Merge existing item data with updates
        group.items[itemIndex] = { ...group.items[itemIndex], ...updates };

        await ctx.stub.putState(icsNumber, Buffer.from(JSON.stringify(group)));
        return JSON.stringify(group.items[itemIndex]);
    }

    // --- DELETE ---
    async DeleteItemFromGroup(ctx, icsNumber, itemId) {
        const group = await this._getGroup(ctx, icsNumber);
        
        const initialLength = group.items.length;
        group.items = group.items.filter(item => item.itemId !== itemId);

        if (group.items.length === initialLength) {
            throw new Error(`Item ${itemId} not found`);
        }

        // If the group is now empty, you might want to delete the whole key
        if (group.items.length === 0) {
            await ctx.stub.deleteState(icsNumber);
            return `Group ${icsNumber} deleted because it became empty.`;
        }

        await ctx.stub.putState(icsNumber, Buffer.from(JSON.stringify(group)));
        return `Item ${itemId} removed from group ${icsNumber}`;
    }

    // --- DELETE ENTIRE GROUP ---
    async DeleteFullGroup(ctx, icsNumber) {
        const exists = await ctx.stub.getState(icsNumber);
        if (!exists || exists.length === 0) {
            throw new Error(`Group ${icsNumber} does not exist`);
        }
        await ctx.stub.deleteState(icsNumber);
    }
}

module.exports = ArticleContract;