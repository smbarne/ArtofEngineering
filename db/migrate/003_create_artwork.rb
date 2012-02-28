class CreateArtwork < ActiveRecord::Migration
  def self.up
    create_table :artwork do |t|
		t.string :sTitle
      t.timestamps
    end
  end

  def self.down
    drop_table :artwork
  end
end
