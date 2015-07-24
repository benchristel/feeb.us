require 'set'

words = Set.new


ANY_SPACE = /\s+/

class Stemmer
  NOT_ALPHANUMERIC = /[^A-zA-Z0-9]/
  ING_ENDING = /ing$/
  ED_ENDING = /ed$/
  S_ENDING = /s$/

  def self.stem word
    word.downcase.gsub(NOT_ALPHANUMERIC, '').gsub(ING_ENDING, '').gsub(ED_ENDING, '').gsub(S_ENDING, '')
  end
end



File.open(ARGV[0], 'r').each do |line|
  next if line.length < 11
  line[11..-1].split(ANY_SPACE).each do |word|
    words << Stemmer.stem(word)
  end
end

puts words.sort
puts words.count
