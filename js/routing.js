// client / server routing table
module.exports = [
    {path: '/', handler: 'viewDefaultPortfolio'},
    {path: '/portfolio', handler: 'viewDefaultPortfolio'},
    {path: '/portfolio/:slug', handler: 'viewOnePortfolio'}
];
