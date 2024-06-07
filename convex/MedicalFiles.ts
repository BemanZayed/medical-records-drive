import { v } from "convex/values";
import { mutation, query } from "./_generated/server";


export const createFiles = mutation({
    args: {
        name: v.string(),
    },
    async handler(ctx, args) {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("You must be logged in to upload a file.");
        }

        await ctx.db.insert("files", {
            name: args.name,

        });
    },
});

export const getFiles = query({
    args: {},
    async handler(ctx, args) {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            return [];
        }
        return ctx.db.query('files').collect();
    },
});

