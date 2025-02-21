const { EmbedBuilder, PermissionFlagsBits, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const db = require('croxydb');

module.exports = {
    name: "ticket-kur",
    description: "Ticket sistemini kurar.",
    options: [
        {
            name: "ticket-mesajı",
            description: "Ticket mesajını belirtin.",
            type: 3,
            required: true
        },
        {
            name: "log-kanalı",
            description: "Log kanalını belirtin.",
            type: 7,
            required: true
        },
        {
            name: "yetkili-rol",
            description: "Yetkili rolü seçin.",
            type: 8,
            required: true
        },
        {
            name: "ticket-buton-mesajı",
            description: "Ticket açma butonunun ismini belirtin.",
            type: 3
        },
    ],

    /**
     * @param {import("discord.js").Client} client
     * @param {import("discord.js").ChatInputCommandInteraction} interaction
     */
    run: async (client, interaction) => {
        const logChannel = interaction.options.getChannel("log-kanalı");
        const ticketMessage = interaction.options.getString("ticket-mesajı") || "Ticket oluşturmak için aşağıda bulunan butona tıklayınız.";
        const ticketButtonMessage = interaction.options.getString("ticket-buton-mesajı") || "Ticket Oluştur";
        const yetkiliRol = interaction.options.getRole("yetkili-rol"); 

        if (!(interaction.member.permissions.has(PermissionFlagsBits.Administrator))) {
            const errEmbed = new EmbedBuilder()
                .setAuthor({ name: `${interaction.user.globalName || interaction.user.username} (@${interaction.user.username})`, avatarURL: interaction.user.displayAvatarURL() })
                .setDescription('Bu komutu kullanma yetkiniz bulunmamaktadır.')
                .setColor('Red')
                .setFooter({ text: "wondexz tarafından geliştirildi." })

            return interaction.reply({ embeds: [errEmbed], ephemeral: true });
        }

        if (db.has(`ticket_${interaction.guild.id}`)) {
            const errEmbed = new EmbedBuilder()
                .setAuthor({ name: `${interaction.user.globalName || interaction.user.username} (@${interaction.user.username})`, avatarURL: interaction.user.avatarURL() })
                .setDescription('Ticket sistemi zaten kurulmuş durumda.')
                .setColor('Red')
                .setFooter({ text: "wondexz tarafından geliştirildi." })

            return interaction.reply({ embeds: [errEmbed], ephemeral: true });
        }

        const embed = new EmbedBuilder()
            .setColor("Green")
            .setAuthor({ name: `${interaction.user.globalName || interaction.user.username} (@${interaction.user.username})`, avatarURL: interaction.user.avatarURL() })
            .setDescription("Ticket sistemi başarıyla kuruldu.")
            .setFooter({ text: "wondexz tarafından geliştirildi." })

        db.set(`ticket_${interaction.guild.id}`, {
            logChannel: logChannel.id,
            yetkiliRol: yetkiliRol.id
        });

        const ticketEmbed = new EmbedBuilder()
        .setColor("Blue")
        .setAuthor({ name: `${interaction.guild.name} | Ticket Sistemi`, avatarURL: interaction.guild.iconURL() })
        .setDescription(ticketMessage)
        .setThumbnail(interaction.guild.iconURL())

        const ticketMessageButton = new ButtonBuilder()
            .setStyle(ButtonStyle.Primary)
            .setLabel(ticketButtonMessage)
            .setCustomId("ticket-open");

        const row = new ActionRowBuilder().addComponents(ticketMessageButton);

        interaction.reply({ embeds: [embed] })
        logChannel.send({ embeds: [ticketEmbed], components: [row] });
    }
}