# Defines our constants
PADRINO_ENV  = ENV['PADRINO_ENV'] ||= ENV['RACK_ENV'] ||= 'development'  unless defined?(PADRINO_ENV)
PADRINO_ROOT = File.expand_path('../..', __FILE__) unless defined?(PADRINO_ROOT)

# Load our dependencies
require 'rubygems' unless defined?(Gem)
require 'bundler/setup'
Bundler.require(:default, PADRINO_ENV)

require 'json'
require 'open-uri'
require 'rss'
require 'set'

## Enable devel logging
#Padrino::Logger::Config[:development][:log_level] = :devel
Padrino::Logger::Config[:development][:log_static] = true

## Configure your I18n
I18n.enforce_available_locales = false
I18n.default_locale = :en

##
# Add your before (RE)load hooks here
#
Padrino.before_load do
end

##
# Add your after (RE)load hooks here
#
Padrino.after_load do
end

Padrino.load!
