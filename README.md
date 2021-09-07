# AND Lab Website

**Artificial Intelligence, Neuroscience and Decision Lab**

AND Lab is part of [CCBS](https://ccbs.ici.um.edu.mo) at [University of Macau](https://um.edu.mo).

This website is built with [Jekyll](https://jekyllrb.com/). It is derived from the great template provided by [research-lab-website](https://github.com/ericdaat/research-lab-website) and [Allan Lab](https://www.allanlab.org/aboutwebsite.html), at Leiden University.
## Setup

Install Ruby firstly, then install Jekyll.

``` bash
gem install bundler jekyll
```

Clone this repository, then install the dependencies:

``` bash
bundle install
```

## Run

Run the local webserver with:

``` bash
bundle exec jekyll serve
```

## Contribute

### Add a new member

New members are stored as ymal files under
[_data/member.yml](_data/member.yml).

Each entry must look like this:

> It's better to learn some basic rules of ymal, like [YAML tutorial in the context of Jekyll](https://idratherbewriting.com/documentation-theme-jekyll/mydoc_yaml_tutorial). Some items are not necessary.

``` yaml
- title: Role of following members
  members:
    - name: Member name
      image: Member image file name
      content: Some description
      social:
        email: Email address
        website: Personal website
```

### Add a new publication

Publications are stored as ymal file under
[_data/publication.yml](_data/publication.yml).

Just add a new entry like this:

``` yml
- title: Publication title
  authors: Author names
  year: Publish year
  publisher: Publisher name
  page: Publish page
  abstract: Abstract text
  link: Paper link, like "https://doi.org/10.1080/00952990.2019.1608554"

```

### Add news

Just post it on lab twitter account. You have to specify your twitter account in [_includes/news_side.html](_includes/news_side.html) initially.

### Edit template

We use [Bootstrap v3](https://getbootstrap.com/) for designing the website.
Feel free to modify either the [_pages](_pages/) or the
[_layouts](_layouts/) components.
