const { EmbedBuilder } = require('discord.js');
const db = require('croxydb');

module.exports = {
    name: "ticket-sıfırla",
    description: "Ticket sistemini sıfırlar.",
    /**
     * 
     * @param {import("discord.js").Client} client
     * @param {import("discord.js").ChatInputCommandInteraction} interaction
     */
    run: async (client, interaction) => {
        if (!db.has(`ticket_${interaction.guild.id}`)) {
            const errEmbed = new EmbedBuilder()
                .setAuthor({ name: `${interaction.user.globalName || interaction.user.username} (@${interaction.user.username})`, icon: interaction.user.displayAvatarURL() })
                .setDescription('Ticket sistemi zaten kurulu değil.')
                .setColor('Red')
                .setFooter({ text: "wondexz tarafından geliştirildi." })

            return interaction.reply({ embeds: [errEmbed], ephemeral: true });
        }

        db.delete(`ticket_${interaction.guild.id}`);

        const embed = new EmbedBuilder()
            .setAuthor({ name: `${interaction.user.globalName || interaction.user.username} (@${interaction.user.username})`, icon: interaction.user.displayAvatarURL() })
            .setDescription('Ticket sistemi başarıyla sıfırlandı.')
            .setColor('Green')
            .setFooter({ text: "wondexz tarafından geliştirildi." })

        interaction.reply({ embeds: [embed], ephemeral: true });
    }
}
