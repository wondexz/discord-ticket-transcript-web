const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: "ping",
    description: "Botun pingini gösterir.",

    run: async (client, interaction) => {
        const embed = new EmbedBuilder()
            .setColor("Green")
            .setAuthor({ name: `${interaction.user.globalName || interaction.user.username} (@${interaction.user.username})`, icon: interaction.user.displayAvatarURL() })
            .setDescription(client.ws.ping + "ms")
            .setFooter({ text: "wondexz tarafından geliştirildi." })

        interaction.reply({ embeds: [embed] })
    }
}