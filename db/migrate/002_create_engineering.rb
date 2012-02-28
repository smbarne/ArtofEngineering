class CreateEngineering < ActiveRecord::Migration
  def self.up
    create_table :engineering do |t|
		t.string :sTitle
      t.timestamps
    end
  end

  def self.down
    drop_table :engineering
  end
end
