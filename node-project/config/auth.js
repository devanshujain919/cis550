module.exports = {

    'facebookAuth' : {
        'clientID'        : '380222705646830', // your App ID
        'clientSecret'    : '525d9196f5c5c2025e8a5a6accff6f72', // your App Secret
        'callbackURL'     : 'http://ec2-52-91-123-32.compute-1.amazonaws.com:8080/auth/facebook/callback',
        'profileURL'      : 'https://graph.facebook.com/v2.5/me?fields=first_name,last_name,email'

    },

    'googleAuth' : {
        'clientID'         : '693446266726-34rd5odhsacvdl1gfi632cd4arfpd6bg.apps.googleusercontent.com',
        'clientSecret'     : 'WuywcOeENtoS9gSFH-riTucF',
        'callbackURL'      : 'http://localhost:8080/auth/google/callback'
    }

    // 'googleAuth' : {
    //     'clientID'         : '671465115493-i6khfmi9ih9skavok450arceguk03en2.apps.googleusercontent.com',
    //     'clientSecret'     : 'W5GSgBF6L2OXEJVKkUeF2s9m',
    //     'callbackURL'      : 'http://ec2-52-91-123-32.compute-1.amazonaws.com:8080/auth/google/callback'
    // }


};