'use strict';
/* directives */

var phLibrairy = angular.module('phLibrairy');


phLibrairy.directive('phOrder', ['$document', '$timeout', function($document, $timeout) {

    return {
        restrict: 'A',
        link: function(scope, element, attrs)  {
            var selector = attrs["phOrder"];
            
            // show baskets when drag start
            $document.bind('dragstart', function(evt) {
                /*
                 * use $timeout here to prevent a bug in chrome when changing dom on drag event
                 */
                $timeout(function() {
                    var baskets = element.find(selector);
                    element.find(selector).css('display', 'block')
                }, 0);
            });
            // hide baskets on leave
            $document.bind('dragend', function(evt) {
                // hide baskets on dragend
                element.find(selector).css('display', 'none');
            });
        }
    }
}]);

phLibrairy.directive('phDragOn', ['$document', '$timeout',
        function($document, $timeout) {
    function resetMargin(article) {
        article.css('margin-left', '3px');
        article.css('margin-right', '0');
    };
    function resetBasket(basket) {
        basket.css('width', '50%');
    };
    return {
        restrict: 'A',
        link: function(scope, basket, attrs) {
            var side = attrs['side'];
            var article = basket.parent('article');
            var drop_margin = article.width();
            var basket_width = basket.width();

            basket.bind('dragenter', function(evt) {
                drop_margin = article.width();
                basket_width = basket.width();
            });
            basket.bind('dragover', function(evt) {
                console.log(basket_width + drop_margin);
                if (side == 'right') {
                    article.css('margin-right', drop_margin + 3);
                }
                if (side == 'left') {
                    article.css('margin-left', drop_margin);
                }
                basket.css('width', basket_width + drop_margin );
            });

            basket.bind('dragleave', function(evt) {
                console.log('dragleave');
                resetMargin(article);
                resetBasket(basket, side);
            });
            $document.bind('dragend', function(evt) {
                console.log('dragend');
                resetMargin(article);
                resetBasket(basket);
            });
        }
    };
}]);

