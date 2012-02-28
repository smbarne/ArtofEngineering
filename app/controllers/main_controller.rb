class MainController < ApplicationController
#before_filter :login_required
layout "main"
			    
  def index
  	
	respond_to do |format|
	  format.html  # index.html.erb
	end
  end
  
  def contact

	respond_to do |format|
	  format.html  # contact.html.erb
	end  
  end
  
  def bio
  
	respond_to do |format|
	  format.html  # bio.html.erb
	end  
  end
  
  end
