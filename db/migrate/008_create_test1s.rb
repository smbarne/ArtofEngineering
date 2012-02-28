class CreateTest1s < ActiveRecord::Migration
  def self.up
    create_table :test1s do |t|

      t.timestamps
    end
  end

  def self.down
    drop_table :test1s
  end
end
