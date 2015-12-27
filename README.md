# Phiroom #
## The cms for photographers ##
### Introduction ###
Phiroom is a content management system built for photographers.

### Features ###
It helps you to create a personnal website including differents publics modules:
* a weblog;
* some portfolios where you can show your pictures;
* a contact page.

All the app has server side rendered javascript for better user experience, SEO and accessibility

### Road map features ###
It also provides a "librairy" module *(not implemented yet)*, with restricted access where you can:
* add pictures to your librairy;
* sort your pictures by "collections";
* add pictures to a portfolio or a weblog post via drag & drop;
* sort a portfolio's or weblog post's pictures via drag & drop;
* give specific users access to particular collections.

### Installation ###
Please read [INSTALL.md](/INSTALL.md)

### Technologies ###
Phiroom uses :
* A rest API to retrieve datas built with :
  * [Django](http://docs.wand-py.org/);
  * [Django rest framework](http://docs.wand-py.org/);
  * Pictures previews are generated with [Wand](http://docs.wand-py.org/);
* A server side rendered UI built with :
  * [React](https://facebook.github.io/react/), [redux](http://rackt.org/redux/index.html) and [react-router](https://github.com/rackt/react-router) among other librairies.


### Websites using phiroom ###
* [lavilotte-rolle.fr](http://lavilotte-rolle.fr) uses the last released version of phiroom.

