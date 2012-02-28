 module SidebarHelper
	  def populate_sidebar(category)
		@galleries = Gallery.find(:all, :conditions => ["sType = ?", category], :order => "iOrder")
		@sidebar = category
	  end
  end
