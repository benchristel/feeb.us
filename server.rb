require 'sinatra'

get '/' do
  File.read(File.dirname(__FILE__) + '/index.html')
end

