// Multiple file upload element (Mootools 1.1 version) by Stickman http://the-stickman.com
// Licence: You may use this script as you wish without limitation, however I would appreciate it if you left at least the credit and site link above in place. I accept no liability for any problems or damage encountered as a result of using this script.
// Modifications by: SilverTab (http://www.silverscripting.com) to allow compatibility with Rails + file_column

var MultiUpload = new Class(
{
 
    new MultiUpload( $( ‘main_form‘ ).user_picture, 3, ‘[{id}][image]‘, true, true, ‘[{id}][image_temp]‘ );

	initialize:function( input_element, max, name_suffix_template, show_filename_only, remove_empty_element, hidden_suffix_template ){

		// Sanity check -- make sure it's  file input element
		if( !( input_element.tagName == 'INPUT' && input_element.type == 'file' ) ){
			alert( 'Error: not a file input element' );
			return;
		}

		// List of elements
		this.elements = [];

		
		// Lookup for row ID => array ID
		this.uid_lookup = {};
		// Current row ID
		this.uid = 0;

		// Maximum number of selected files (default = 0, ie. no limit)
		// This is optional
		if( $defined( max ) ){
			this.max = max;
		} else {
			this.max = 0;
		}

		// Template for adding id to file name
		// This is optional
		if( $defined( name_suffix_template ) ){
			this.name_suffix_template = name_suffix_template;
		} else {
			this.name_suffix_template= '_{id}';
		}
		
		if( $defined( hidden_suffix_template ) ){
			this.hidden_suffix_template = hidden_suffix_template;
		} else {
			this.hidden_suffix_template= '_{id}_temp';
		}

		// Show only filename (i.e. remove path)
		// This is optional
		if( $defined( show_filename_only ) ){
			this.show_filename_only = show_filename_only;
		} else {
			this.show_filename_only = false;
		}
		
		// Remove empty element before submitting form
		// This is optional
		if( $defined( remove_empty_element ) ){
			this.remove_empty_element = remove_empty_element;
		} else {
			this.remove_empty_element = false;
		}

		// Add element methods
		$( input_element );

		// Base name for input elements
		this.name = input_element.name;
		var input_hidden = new Element(
			'input',
			{
				'type':'hidden'
			}
		);
		// Set up element for multi-upload functionality
		this.initializeElement( input_element, input_hidden );
		input_hidden.injectAfter(input_element);

		
		// Files list
		var container = new Element(
			'div',
			{
				'class':'multiupload'
			}
		);
		this.list = new Element(
			'div',
			{
				'class':'list'
			}
		);
		container.injectAfter( input_element );
		container.adopt( input_element );
		container.adopt( this.list );
		
		// Causes the 'extra' (empty) element not to be submitted
		if( this.remove_empty_element){
			input_element.form.addEvent(
				'submit',function(){
					this.elements.getLast().element.disabled = true;
					this.elements.getLast().hiddenelement.disabled = true;
				}.bind( this )
			);
		}
	},

	
	/**
	 * Called when a file is selected
	 */
	addRow:function(){
		if( this.max == 0 || this.elements.length <= this.max ){
		
			current_element = this.elements.getLast();

			// Create new row in files list
			var name = current_element.element.value;
			// Extract file name?
			if( this.show_filename_only ){
				if( name.contains( '\\' ) ){
					name = name.substring( name.lastIndexOf( '\\' ) + 1 );
				}
				if( name.contains( '//' ) ){
					name = name.substring( name.lastIndexOf( '//' ) + 1 );
				}
			}
			var item = new Element(
				'span'
			).setText( name );
			var delete_button = new Element(
				'img',
				{
					'src':'/images/cross_small.gif',
					'alt':'Delete',
					'title':'Delete',
					'events':{
						'click':function( uid ){
							this.deleteRow( uid );
						}.pass( current_element.uid, this )
					}
				}
			);
			var row_element = new Element(
				'div',
				{
					'class':'item'
				}
			).adopt( delete_button ).adopt( item );
			this.list.adopt( row_element );
			current_element.row = row_element;
			
			// Create new file input element
			var new_input = new Element
			(
				'input',
				{
					'type':'file',
					'disabled':( this.elements.length == this.max )?true:false
				}
			);
			
			var new_hidden_input = new Element
			(
				'input',
				{
					'type':'hidden'
				}
			)
			
			// Apply multi-upload functionality to new element
			this.initializeElement(new_input, new_hidden_input);
			
			// Add new element to page
			current_element.element.style.position = 'absolute';
			current_element.element.style.left = '-1000px';
			new_input.injectAfter( current_element.element );
			new_hidden_input.injectAfter(current_element.element);
		} else {
			alert( 'You may not upload more than ' + this.max + ' files'  );
		}
		
	},

	/**
	 * Called when the delete button of a row is clicked
	 */
	deleteRow:function( uid ){
	
		// Confirm before delete
		deleted_row = this.elements[ this.uid_lookup[ uid ] ];
		if( confirm( 'Are you sure you want to remove the item\r\n' +  deleted_row.element.value + '\r\nfrom the upload queue?' ) ){
			this.elements.getLast().element.disabled = false;
			deleted_row.element.remove();
			deleted_row.row.remove();
			deleted_row.hiddenelement.remove();
			// Get rid of this row in the elements list
			delete(this.elements[  this.uid_lookup[ uid ] ]);

			// Rewrite IDs
			var new_elements=[];
			this.uid_lookup = {};
			for( var i = 0; i < this.elements.length; i++ ){
				if( $defined( this.elements[ i ] ) ){
					this.elements[ i ].element.name = this.name + this.name_suffix_template.replace( /\{id\}/, new_elements.length );
					this.elements[ i ].hiddenelement.name = this.name + this.hidden_suffix_template.replace(/\{id\}/, new_elements.length)
					this.uid_lookup[ this.elements[ i ].uid ] = new_elements.length;
					new_elements.push( this.elements[ i ] );

				}
				
			
			}
			this.elements = new_elements;

		}
	},

	/**
	 * Apply multi-upload functionality to an element
	 *
	 * @param		HTTPFileInputElement		element		The element
	 */
	initializeElement:function( element, hiddenelement ){

		// What happens when a file is selected
		element.addEvent(
			'change',
			function(){
				this.addRow()
			}.bind( this )
		);
		// Set the name
		element.name = this.name + this.name_suffix_template.replace( /\{id\}/, this.elements.length );
		hiddenelement.name = this.name + this.hidden_suffix_template.replace(/\{id\}/, this.elements.length)
		// Store it for later
		
		this.uid_lookup[ this.uid ] = this.elements.length;
		this.elements.push( { 'uid':this.uid, 'element':element, 'hiddenelement':hiddenelement } );
		this.uid++;
	
	}
}
);