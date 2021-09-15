class Kanban {
	constructor(el, args) {
		this.kanbanEL = el;
		this.boards = args.boards;
		this.items = args.items;
		this.onMove = args.onMove;
		this.onClick = args.onClick;
		this.itemFeed = args.itemFeed;
		//add css class to div
		$(this.kanbanEL).addClass('kanban-container');

		this.readFeed();

		//render the boards
		this.renderBoards();
	}

	readFeed() {
		$.ajax({
		  url: this.itemFeed,
		  type: 'GET',
		  dataType: 'xml/html/script/json/jsonp',
		  success: function(data, textStatus, xhr) {
		  	this.itemFeed = data;
		  	this.renderItems();
		  },
		  error: function(xhr, textStatus, errorThrown) {
		  	
		  }
		});
		
	}

	renderBoards() {
		$(this.kanbanEL).empty();
		this.boards.forEach((board) => {
			const title = board.title;
			const id = board.id;

			$('<div></div>')
				.addClass('kanban-board')
				.attr("id", id)
				.html([
						$('<div></div>').addClass('kanban-title').html(title),
						$('<div></div>').addClass('kanban-items-container').sortable({
								connectWith: ".kanban-items-container",
								stop: function(event, ui) {
									var itemId = ui.item.data('id');

									var newIndex = ui.item.index();
									var newBoard = ui.item.parent().parent().attr('id');

									this.items[itemId].boardId = newBoard;
									this.onMove(this.items[itemId], itemId)
								}.bind(this)
							})
							.disableSelection()
							.click( this.onClick )
					])
				.appendTo(this.kanbanEL);
		});

		this.renderItems()
	}

	renderItems() {
		this.items.forEach((item, itemId) => {
			const title = item.title;
			const boardID = item.boardId;

			$('<div></div>').addClass('kanban-item').data('id', itemId)
				.html(
					title
				).appendTo("#" + boardID + " > .kanban-items-container");

		});
	}



}