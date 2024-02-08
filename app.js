const { createBot, createProvider, createFlow, addKeyword, EVENTS } = require('@bot-whatsapp/bot')

const TwilioProvider = require('@bot-whatsapp/provider/twilio')
const MockAdapter = require('@bot-whatsapp/database/mock')
require('dotenv').config();
/**
 * Aqui declaramos los flujos hijos, los flujos se declaran de atras para adelante, es decir que si tienes un flujo de este tipo:
 *
 *          Menu Principal
 *           - SubMenu 1
 *             - Submenu 1.1
 *           - Submenu 2
 *             - Submenu 2.1
 *
 * Primero declaras los submenus 1.1 y 2.1, luego el 1 y 2 y al final el principal.
 */

const flowSecundario = addKeyword(['2', 'siguiente']).addAnswer(['📄 Aquí tenemos el flujo secundario'])

const flowDocs = addKeyword(['doc', 'documentacion', 'documentación']).addAnswer(
    [
        '📄 Aquí encontras las documentación recuerda que puedes mejorarla',
        'https://bot-whatsapp.netlify.app/',
        '\n*2* Para siguiente paso.',
    ],
    null,
    null,
    [flowSecundario]
)

const flowTuto = addKeyword(['tutorial', 'tuto']).addAnswer(
    [
        '🙌 Aquí encontras un ejemplo rapido',
        'https://bot-whatsapp.netlify.app/docs/example/',
        '\n*2* Para siguiente paso.',
    ],
    null,
    null,
    [flowSecundario]
)

const flowGracias = addKeyword(['gracias', 'grac']).addAnswer(
    [
        '🚀 Puedes aportar tu granito de arena a este proyecto',
        '[*opencollective*] https://opencollective.com/bot-whatsapp',
        '[*buymeacoffee*] https://www.buymeacoffee.com/leifermendez',
        '[*patreon*] https://www.patreon.com/leifermendez',
        '\n*2* Para siguiente paso.',
    ],
    null,
    null,
    [flowSecundario]
)

const flowDiscord = addKeyword(['discord']).addAnswer(
    ['🤪 Únete al discord', 'https://link.codigoencasa.com/DISCORD', '\n*2* Para siguiente paso.'],
    null,
    null,
    [flowSecundario]
)

const saludo = addKeyword(['hola','ola','buenas','buen']) 
.addAnswer('⚡⚡ Hola bienvenido a Nacional de Electricos ⚡⚡') 
.addAnswer(
        [
            'Digita el *numero* de la opción que necesitas',
            '*1.* Contactar un asesor.',
            '*2.* Preguntar un producto.',
        ],
        null,
        null,
        [flowDocs, flowGracias, flowTuto, flowDiscord]
    )
/* Funcion inciadora de la aplicaicon  */
const main = async () => {
    /* adaptador base de datos  */
    const adapterDB = new MockAdapter()
    /* adaptador flujos de conversacion  */
    const adapterFlow = createFlow([saludo])
    /* adaptador provedor  */

    const adapterProvider = createProvider(TwilioProvider, {
        accountSid: process.env.ACC_SID,
        authToken: process.env.ACC_TOKEN, 
        vendorNumber: process.env.ACC_VENDOR, 
    })

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })
}

main()
