"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Manager = void 0;
const lavacord_1 = require("lavacord");
__exportStar(require("lavacord"), exports);
class Manager extends lavacord_1.Manager {
    client;
    constructor(client, nodes, options) {
        super(nodes, options && !options.user && client.user?.id ? Object.assign(options, { user: client.user.id }) : { user: client.user?.id });
        this.client = client;
        this.send = packet => {
            if (this.client.guilds.cache) {
                const guild = this.client.guilds.cache.get(packet.d.guild_id);
                if (guild)
                    return guild.shard.send(packet);
            }
        };
        client.once("ready", () => {
            this.user = client.user.id;
            this.shards = client.options.shardCount || 1;
        });
        client.ws
            .on("VOICE_SERVER_UPDATE", (packet) => this.voiceServerUpdate({ guild_id: packet.guild_id }))
            .on("VOICE_STATE_UPDATE", (packet) => this.voiceStateUpdate({ user_id: packet.user_id, channel_id: packet.channel_id, guild_id: packet.guild_id }))
            .on("GUILD_CREATE", async (data) => {
            for (const state of data.voice_states)
                await this.voiceStateUpdate({ ...state, guild_id: data.id });
        });
    }
}
exports.Manager = Manager;
//# sourceMappingURL=index.js.map
