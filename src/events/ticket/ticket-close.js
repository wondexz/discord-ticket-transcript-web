const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const db = require('croxydb');
const { v4: uuidv4 } = require('uuid');
const discordTranscripts = require('discord-html-transcripts');
const crypto = require('crypto');
const fs = require('fs');
const config = require('../../../config');

module.exports = {
    name: "interactionCreate",
    /**
     * 
     * @param {import("discord.js").ChatInputCommandInteraction} interaction 
     * @param {import("discord.js").Client} client
     */
    run: async (client, interaction) => {
        if (interaction.customId === "ticket-close") {
            const ticketOwner = db.get(interaction.channel.id);
            const data = db.get(`ticket_${interaction.guild.id}`);
            const sira = db.get(`destekSıra_${interaction.guild.id}`);
            const logChannel = client.channels.cache.get(data.logChannel);

            if (!data) return;

            const messages = await interaction.channel.messages.fetch({ limit: 100 });

            const attachment = await discordTranscripts.generateFromMessages(messages, interaction.channel);

            function hash(text) {
                return crypto.createHash('sha256').update(text).digest('hex');
            }

            const fileName = uuidv4()
            const filePath = `./transcripts/${fileName}`;

            let contentToWrite = attachment.content || (attachment.attachment ? attachment.attachment.toString() : null);

            if (!contentToWrite) {
                console.error("Attachment içeriği alınamıyor.");
                return;
            }

            fs.writeFileSync(filePath, contentToWrite);

            const urlbutton = new ButtonBuilder()
                .setURL(`${config.domain}/ticket/${fileName}`)
                .setLabel('Mesajları Görüntüle')
                .setStyle(ButtonStyle.Link)

            const downlaodbutton = new ButtonBuilder()
            .setURL(`${config.domain}/ticket/download/${fileName}`)
            .setLabel('Mesajları İndir')
            .setStyle(ButtonStyle.Link)

            const row = new ActionRowBuilder().addComponents(urlbutton, downlaodbutton);

            logChannel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Red")
                        .setAuthor({ name: `${ticketOwner.username} - Destek Kapatıldı`, iconURL: ticketOwner.avatar })
                        .setThumbnail(interaction.guild.iconURL())
                        .setFooter({ text: `${client.user.username} ©️ Tüm hakları saklıdır.`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
                        .setDescription(`Destek talebi başarıyla kapatıldı.\n**•** Kapatan kullanıcı <@${interaction.user.id}> (___@${interaction.user.username}___)\n**•** Talebi açan kullanıcı <@${ticketOwner.userid}> (@${ticketOwner.username})`),
                ],
                components: [row]
            });

            db.delete(interaction.channel.id);
            interaction.channel.delete();
        }
    }
};