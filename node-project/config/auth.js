
module.exports = {

    'facebookAuth' : {
        'clientID'        : '582544748603289', // your App ID
        'clientSecret'    : '40ef65dc68b0dcc2e02623935a8a8635', // your App Secret
        'callbackURL'     : 'http://localhost:8080/auth/facebook/callback',
        'profileURL': 'https://graph.facebook.com/v2.5/me?fields=first_name,last_name,email'

    },  

    'googleAuth' : {
        'clientID'         : '671465115493-i6khfmi9ih9skavok450arceguk03en2.apps.googleusercontent.com',
        'clientSecret'     : 'W5GSgBF6L2OXEJVKkUeF2s9m',
        'callbackURL'      : 'http://localhost:8080/auth/google/callback'
    }

};
