var React = require('react');

var MainMenu = React.createClass({
    render: function() {
        return (
            <ul id="menu">
                <li><a href="">Portfolios</a></li>
                <li><a href="">Weblog</a></li>
                <li><a href="">Contact</a></li>
                <li><a href="">Librairy</a></li>
            </ul>
        );
    }
});


module.exports = MainMenu;

