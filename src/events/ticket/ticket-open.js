const { EmbedBuilder, ChannelType, PermissionsBitField, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const db = require('croxydb');

module.exports = {
    name: "interactionCreate",
    /**
     * 
     * @param {import("discord.js").ChatInputCommandInteraction} interaction 
     * @param {import("discord.js").Client} client
     */
    run: async (client, interaction) => {
        if (interaction.customId === "ticket-open") {
            if (!db.has(`ticket_${interaction.guild.id}`)) return;
            const data = db.get(`ticket_${interaction.guild.id}`);
            db.add(`ticketSıra_${interaction.guild.id}`, 1);
            const sıra = db.get(`ticketSıra_${interaction.guild.id}`);

            interaction.guild.channels.create({
                name: `ticket-${sıra}`,
                type: ChannelType.GuildText,
                permissionOverwrites: [
                    {
                        id: interaction.guild.id,
                        deny: [PermissionsBitField.Flags.ViewChannel],
                    },
                    {
                        id: interaction.user.id,
                        allow: [PermissionsBitField.Flags.ViewChannel],
                    },
                    {
                        id: data.yetkiliRol,
                        allow: [PermissionsBitField.Flags.ViewChannel],
                    },
                ],
            }).then((cha) => {
                db.set(cha.id, { userid: interaction.user.id, avatar: interaction.user.avatarURL(), username: interaction.user.username });
                interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor("Green")
                            .setAuthor({ name: `${interaction.user.globalName || interaction.user.username} (@${interaction.user.username})`, avatarURL: interaction.user.avatarURL() })
                            .setDescription(`Ticket başarıyla oluşturuldu ${cha}`),
                    ],
                    ephemeral: true,
                });

                const embed = new EmbedBuilder()
                    .setColor("Green")
                    .setAuthor({ name: `${interaction.user.globalName || interaction.user.username} (@${interaction.user.username})`, iconURL: interaction.user.avatarURL() })
                    .setDescription(`Başarıyla __destek__ talebin açıldı, yetkilileri bekle!`)
                    .setThumbnail(interaction.guild.iconURL());

                const button = new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setLabel("Ticketı Kapat")
                        .setStyle(ButtonStyle.Danger)
                        .setCustomId("ticket-close")
                );

                const etiket = `<@${interaction.user.id}> | <@&${data.yetkiliRol}>`;

                cha.send({
                    content: etiket,
                    embeds: [embed],
                    components: [button]
                });
            });
        }
    }
};