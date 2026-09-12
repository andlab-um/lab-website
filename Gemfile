source 'https://rubygems.org'

gem "jekyll"
gem "github-pages"

# Ruby bundled with this workstation is 2.6; newer ffi releases require Ruby 3.
# Pinning the final 1.15 release keeps the upstream Jekyll/GitHub Pages setup runnable locally.
gem "ffi", "~> 1.15.5"
# The last Nokogiri branch supporting the workstation's Ruby 2.6 runtime.
gem "nokogiri", "< 1.16"

gem "webrick"
gem 'wdm', '>= 0.1.0' if Gem.win_platform?
