require('dotenv').config();
const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

const sendOrderConfirmation = async (clientEmail,order) => {
  try {
    const articlesRows = order.articles
    .map(
      (item) => `
      <tr>
        <td>${item.article.name}</td>
        <td>${item.quantity}</td>
        <td>${item.article.price * item.quantity} FCFA</td>
      </tr>
    `
    )
    .join('');

    await resend.emails.send({
      from: 'back-market@csn-ci.com',
      to: clientEmail,
      subject: 'Votre commande chez back market a été confirmée',
      html: `
            <!DOCTYPE html>
              <html lang="fr">
                <head>
                  <meta charset="UTF-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <style>
                    body {
                      font-family: Arial, sans-serif;
                      background-color: #f6f6f6;
                      margin: 0;
                      padding: 0;
                      }
                    .email-container {
                      max-width: 600px;
                      margin: 0 auto;
                      background-color: #ffffff;
                      border: 1px solid #e0e0e0;
                      border-radius: 8px;
                      overflow: hidden;
                      }
                    .email-header {
                      background-color: #4caf50;
                      color: #ffffff;
                      padding: 20px;
                      text-align: center;
                      font-size: 24px;
                      }
                    .email-body {
                      padding: 20px;
                      line-height: 1.6;
                      color: #333333;
                      }
                    .email-body h2 {
                      color: #4caf50;
                      }
                    .email-footer {
                      background-color: #f0f0f0;
      color: #777777;
      padding: 10px;
      text-align: center;
      font-size: 12px;
    }
    .order-summary {
      margin: 20px 0;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      overflow: hidden;
    }
    .order-summary th, .order-summary td {
      padding: 15px;
      text-align: left;
      border-bottom: 1px solid #e0e0e0;
    }
    .order-summary th {
      background-color: #f9f9f9;
      color: #333333;
    }
    .button {
      display: inline-block;
      background-color: #4caf50;
      color: white;
      padding: 10px 20px;
      text-align: center;
      border-radius: 5px;
      text-decoration: none;
      font-size: 16px;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <!-- En-tête -->
    <div class="email-header">
      Merci pour votre commande chez La jeune fermière !
    </div>
    
    <!-- Corps du mail -->
    <div class="email-body">
      <h2>Bonjour ${order.customer.name},</h2>
      <p>Nous vous remercions d'avoir passé commande chez la jeune fermière. Voici un récapitulatif de votre commande :</p>

      <!-- Détails de la commande -->
      <div class="order-summary">
        <table width="100%">
          <thead>
            <tr>
              <th>Produit</th>
              <th>Quantité</th>
              <th>Prix</th>
            </tr>
          </thead>
          <tbody>
            ${articlesRows}
            <tr>
              <td colspan="2"><strong>Total :</strong></td>
              <td><strong>${order.totalPrice} FCFA</strong></td>
            </tr>
          </tbody>
        </table>
      </div>

      <p>Nous préparons actuellement votre commande et vous informerons dès qu'elle sera expédiée.</p>

      <p>Si vous avez des questions, n'hésitez pas à nous contacter.</p>

      <!-- Bouton -->
      <p style="text-align:center;">
        <a href="[Lien de Suivi]" class="button">Nous contacter</a>
      </p>

      <p>Merci de faire confiance à la jeune fermière et à bientôt !</p>
    </div>

    <!-- Pied de page -->
    <div class="email-footer">
      &copy; 2024 CSN-CI - Tous droits réservés.<br>
      Si vous ne souhaitez plus recevoir d'emails, <a href="[Lien de Désinscription]">cliquez ici</a>.
    </div>
  </div>
</body>
</html>`
    });
    console.log('Email envoyé avec succès');
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error);
  }
};

module.exports = sendOrderConfirmation;
