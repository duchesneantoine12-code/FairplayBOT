require("dotenv").config();

const {
  Client,
  GatewayIntentBits,
  EmbedBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  PermissionsBitField
} = require("discord.js");

const TOKEN = process.env.TOKEN;

const STAFF_ROLE_ID = "1509831863727034488";
const GERANT_ROLE_ID = "1384888540944531597";
const REGLEMENT_ROLE_ID = "1384888813909708891";
const WELCOME_CHANNEL_ID = "1509844222205755482";

const LOG_TICKET_CHANNEL_ID = "1509864410414583938";
const LOG_MODERATION_CHANNEL_ID = "1509864459118575656";
const LOG_JOIN_LEAVE_CHANNEL_ID = "1509864565016629329";

const ORANGE = 0xff7a00;
const RED = 0xff0000;
const GREEN = 0x00ff00;

const LOGO = "https://media.discordapp.net/attachments/1444008292178333768/1509866221158268991/logo.png?ex=6a1abbff&is=6a196a7f&hm=dca6657188d436e05d729aa6f24f93fad2ea1cdaa6c35a927ec18e7ee2df3eaa&=&format=webp&quality=lossless";
const BANNIERE = "https://media.discordapp.net/attachments/1444008292178333768/1509866221590413322/file_00000000457471fd8516fe360f6abe69.png?ex=6a1abbff&is=6a196a7f&hm=efd23c89fcaf134fdbac6e458aa4f8320eca984ce22755f2b990c80b041f7ab3&=&format=webp&quality=lossless&width=856&height=856";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildModeration
  ]
});

client.once("ready", () => {
  console.log(`✅ Fairplay_RP connecté : ${client.user.tag}`);
});

function sendLog(guild, channelId, embed) {
  const channel = guild.channels.cache.get(channelId);
  if (channel) channel.send({ embeds: [embed] }).catch(() => {});
}

client.on("guildMemberAdd", async (member) => {
  const channel = member.guild.channels.cache.get(WELCOME_CHANNEL_ID);

  const welcomeEmbed = new EmbedBuilder()
    .setColor(ORANGE)
    .setAuthor({ name: "Fairplay_RP", iconURL: LOGO })
    .setTitle("🟠 Bienvenue sur Fairplay_RP")
    .setDescription(
      "📜 Merci de lire le règlement du serveur\n" +
      "🪪 Merci de mettre votre **Nom & Prénom RP** sur Discord\n\n" +
      "Nous vous souhaitons un excellent RP parmi nous."
    )
    .setThumbnail(member.user.displayAvatarURL())
    .setImage(BANNIERE)
    .setFooter({ text: "Fairplay_RP • GTA RP", iconURL: LOGO });

  if (channel) {
    await channel.send({
      content: `👋 Bienvenue ${member} !`,
      embeds: [welcomeEmbed]
    });
  }

  const logEmbed = new EmbedBuilder()
    .setColor(GREEN)
    .setTitle("📥 Arrivée membre")
    .addFields(
      { name: "👤 Membre", value: `${member.user.tag}`, inline: true },
      { name: "🆔 ID", value: `${member.id}`, inline: true }
    )
    .setThumbnail(member.user.displayAvatarURL())
    .setTimestamp();

  sendLog(member.guild, LOG_JOIN_LEAVE_CHANNEL_ID, logEmbed);
});

client.on("guildMemberRemove", async (member) => {
  const logEmbed = new EmbedBuilder()
    .setColor(RED)
    .setTitle("📤 Départ membre")
    .addFields(
      { name: "👤 Membre", value: `${member.user.tag}`, inline: true },
      { name: "🆔 ID", value: `${member.id}`, inline: true }
    )
    .setThumbnail(member.user.displayAvatarURL())
    .setTimestamp();

  sendLog(member.guild, LOG_JOIN_LEAVE_CHANNEL_ID, logEmbed);
});

client.on("guildBanAdd", async (ban) => {
  const logEmbed = new EmbedBuilder()
    .setColor(RED)
    .setTitle("🔨 Membre banni")
    .addFields(
      { name: "👤 Membre", value: `${ban.user.tag}`, inline: true },
      { name: "🆔 ID", value: `${ban.user.id}`, inline: true },
      { name: "📝 Raison", value: ban.reason || "Aucune raison indiquée" }
    )
    .setThumbnail(ban.user.displayAvatarURL())
    .setTimestamp();

  sendLog(ban.guild, LOG_MODERATION_CHANNEL_ID, logEmbed);
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  if (message.content === "!test") {
    return message.reply("✅ Le bot fonctionne !");
  }

  if (message.content === "!reglement") {
    const embed = new EmbedBuilder()
      .setColor(ORANGE)
      .setAuthor({ name: "Fairplay_RP | Règlement", iconURL: LOGO })
      .setTitle("📜 Validation du règlement")
      .setDescription(
        "Bienvenue sur **Fairplay_RP**.\n\n" +
        "https://sites.google.com/view/fairplayrp/accueil?authuser=0.\n\n"+
        "Merci de lire attentivement le règlement du serveur.\n\n" +
        "Clique sur le bouton ci-dessous pour obtenir ton accès."
      )
      .setThumbnail(LOGO)
      .setImage(BANNIERE);

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("accept_reglement")
        .setLabel("✅ J'accepte le règlement")
        .setStyle(ButtonStyle.Success)
    );

    return message.channel.send({ embeds: [embed], components: [row] });
  }

  if (message.content === "!ticket") {
    const embed = new EmbedBuilder()
      .setColor(ORANGE)
      .setAuthor({ name: "Fairplay_RP | Tickets", iconURL: LOGO })
      .setTitle("🎫 Centre de support")
      .setDescription("Sélectionne le type de ticket que tu veux ouvrir.")
      .setThumbnail(LOGO);

    const menu = new StringSelectMenuBuilder()
      .setCustomId("ticket_menu")
      .setPlaceholder("🎫 Choisis le type de ticket")
      .addOptions(
        { label: "Support", value: "support", emoji: "🛠️" },
        { label: "Demande Entreprise", value: "entreprise", emoji: "🏢" },
        { label: "Problème Scène", value: "scene", emoji: "⚖️" },
        { label: "Demande Illégal", value: "illegal", emoji: "🔫" },
        { label: "Candidature Staff", value: "candidature_staff", emoji: "👮" },
        { label: "Demande Mort RP", value: "mort_rp", emoji: "💀" },
        { label: "Demande Déban", value: "deban", emoji: "🔓" },
        { label: "Contact Gérant", value: "gerant", emoji: "📞" }
      );

    return message.channel.send({
      embeds: [embed],
      components: [new ActionRowBuilder().addComponents(menu)]
    });
  }

  if (message.content.startsWith("!annonce ")) {
    const args = message.content.slice(9).split("|");
    if (args.length < 2) {
      return message.reply("❌ Utilisation : `!annonce Titre | Texte`");
    }

    const embed = new EmbedBuilder()
      .setColor(ORANGE)
      .setAuthor({ name: "Fairplay_RP | Annonce", iconURL: LOGO })
      .setTitle(`📢 ${args[0].trim()}`)
      .setDescription(args.slice(1).join("|").trim())
      .setThumbnail(LOGO)
      .setImage(BANNIERE)
      .setTimestamp();

    await message.channel.send({
      content: `<@&${REGLEMENT_ROLE_ID}>`,
      embeds: [embed]
    });

    return message.delete().catch(() => {});
  }

  if (message.content.startsWith("!warn ")) {
    const member = message.mentions.members.first();
    const reason = message.content.split(" ").slice(2).join(" ") || "Aucune raison";

    if (!member) return message.reply("❌ Utilisation : `!warn @membre raison`");

    const logEmbed = new EmbedBuilder()
      .setColor(ORANGE)
      .setTitle("⚠️ Warn")
      .addFields(
        { name: "👤 Joueur", value: `${member.user.tag}`, inline: true },
        { name: "👮 Staff", value: `${message.author.tag}`, inline: true },
        { name: "📝 Raison", value: reason }
      )
      .setTimestamp();

    sendLog(message.guild, LOG_MODERATION_CHANNEL_ID, logEmbed);
    return message.reply(`✅ ${member} a reçu un warn.`);
  }

  if (message.content.startsWith("!kick ")) {
    const member = message.mentions.members.first();
    const reason = message.content.split(" ").slice(2).join(" ") || "Aucune raison";

    if (!member) return message.reply("❌ Utilisation : `!kick @membre raison`");

    await member.kick(reason);

    const logEmbed = new EmbedBuilder()
      .setColor(RED)
      .setTitle("👢 Kick")
      .addFields(
        { name: "👤 Joueur", value: `${member.user.tag}`, inline: true },
        { name: "👮 Staff", value: `${message.author.tag}`, inline: true },
        { name: "📝 Raison", value: reason }
      )
      .setTimestamp();

    sendLog(message.guild, LOG_MODERATION_CHANNEL_ID, logEmbed);
    return message.reply(`✅ ${member.user.tag} a été kick.`);
  }

  if (message.content.startsWith("!ban ")) {
    const member = message.mentions.members.first();
    const reason = message.content.split(" ").slice(2).join(" ") || "Aucune raison";

    if (!member) return message.reply("❌ Utilisation : `!ban @membre raison`");

    await member.ban({ reason });

    const logEmbed = new EmbedBuilder()
      .setColor(RED)
      .setTitle("🔨 Ban")
      .addFields(
        { name: "👤 Joueur", value: `${member.user.tag}`, inline: true },
        { name: "👮 Staff", value: `${message.author.tag}`, inline: true },
        { name: "📝 Raison", value: reason }
      )
      .setTimestamp();

    sendLog(message.guild, LOG_MODERATION_CHANNEL_ID, logEmbed);
    return message.reply(`✅ ${member.user.tag} a été banni.`);
  }
});

client.on("interactionCreate", async (interaction) => {
  try {
    if (interaction.isButton() && interaction.customId === "accept_reglement") {
      if (interaction.member.roles.cache.has(REGLEMENT_ROLE_ID)) {
        return interaction.reply({ content: "✅ Tu as déjà validé le règlement.", flags: 64 });
      }

      await interaction.member.roles.add(REGLEMENT_ROLE_ID);
      return interaction.reply({ content: "✅ Règlement validé ! Tu as reçu ton rôle.", flags: 64 });
    }

    if (interaction.isStringSelectMenu() && interaction.customId === "ticket_menu") {
      const ticketTypes = {
        support: { name: "support", label: "Support", emoji: "🛠️", roleId: STAFF_ROLE_ID },
        entreprise: { name: "demande-entreprise", label: "Demande Entreprise", emoji: "🏢", roleId: STAFF_ROLE_ID },
        scene: { name: "probleme-scene", label: "Problème Scène", emoji: "⚖️", roleId: STAFF_ROLE_ID },
        illegal: { name: "demande-illegal", label: "Demande Illégal", emoji: "🔫", roleId: STAFF_ROLE_ID },
        candidature_staff: { name: "candidature-staff", label: "Candidature Staff", emoji: "👮", roleId: STAFF_ROLE_ID },
        mort_rp: { name: "mort-rp", label: "Demande Mort RP", emoji: "💀", roleId: STAFF_ROLE_ID },
        deban: { name: "demande-deban", label: "Demande Déban", emoji: "🔓", roleId: STAFF_ROLE_ID },
        gerant: { name: "contact-gerant", label: "Contact Gérant", emoji: "📞", roleId: GERANT_ROLE_ID }
      };

      const ticket = ticketTypes[interaction.values[0]];

      const channel = await interaction.guild.channels.create({
        name: `${ticket.name}-${interaction.user.id}`,
        type: ChannelType.GuildText,
        permissionOverwrites: [
          { id: interaction.guild.roles.everyone.id, deny: [PermissionsBitField.Flags.ViewChannel] },
          { id: interaction.user.id, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ReadMessageHistory] },
          { id: ticket.roleId, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ReadMessageHistory, PermissionsBitField.Flags.ManageMessages] },
          { id: client.user.id, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ManageChannels] }
        ]
      });

      const closeButton = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("close_ticket")
          .setLabel("🔒 Fermer le ticket")
          .setStyle(ButtonStyle.Danger)
      );

      await channel.send({
        content: `${interaction.user} <@&${ticket.roleId}>`,
        embeds: [
          new EmbedBuilder()
            .setColor(ORANGE)
            .setTitle(`${ticket.emoji} ${ticket.label}`)
            .setDescription(`Bonjour ${interaction.user}, explique clairement ta demande.`)
            .setThumbnail(LOGO)
        ],
        components: [closeButton]
      });

      const logEmbed = new EmbedBuilder()
        .setColor(GREEN)
        .setTitle("🎫 Ticket ouvert")
        .addFields(
          { name: "👤 Joueur", value: `${interaction.user.tag}`, inline: true },
          { name: "📂 Type", value: ticket.label, inline: true },
          { name: "📄 Salon", value: `${channel}`, inline: true }
        )
        .setTimestamp();

      sendLog(interaction.guild, LOG_TICKET_CHANNEL_ID, logEmbed);

      return interaction.reply({ content: `✅ Ticket créé : ${channel}`, flags: 64 });
    }

    if (interaction.isButton() && interaction.customId === "close_ticket") {
      const logEmbed = new EmbedBuilder()
        .setColor(RED)
        .setTitle("🔒 Ticket fermé")
        .addFields(
          { name: "📄 Salon", value: interaction.channel.name },
          { name: "👮 Fermé par", value: `${interaction.user.tag}` }
        )
        .setTimestamp();

      sendLog(interaction.guild, LOG_TICKET_CHANNEL_ID, logEmbed);

      await interaction.reply("🔒 Fermeture du ticket dans 5 secondes...");
      setTimeout(() => interaction.channel.delete().catch(console.error), 5000);
    }
  } catch (error) {
    console.error("❌ Erreur :", error);
    if (!interaction.replied) {
      await interaction.reply({ content: "❌ Erreur : vérifie les permissions du bot.", flags: 64 });
    }
  }
});

client.login(TOKEN);