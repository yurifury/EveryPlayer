require 'rubygems'
require 'sinatra'

get '/' do
  File.readlines("public/index.html")
end

get '/media' do
  content_type "application/json"
  File.readlines("public/mediaclips.json")
end
