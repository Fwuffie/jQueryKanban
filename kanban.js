class Kanban {
	constructor(el, args) {
		this.el = el;
		this.args = args;
		this.boards = args.boards;
		this.items = args.items;
		this.onMove = args.onMove;
		this.onClick = args.onClick;
		this.itemFeed = args.itemFeed;

		//add css class to div
		$(this.el).addClass('kanban-container');

		//render the boards
		this.renderBoards();


		if (this.args.enableScroll === undefined || this.args.enableScroll) {
			this.enableSideScroll()
		}
		

		if (this.itemFeed) {
			this.readFeed();
		}
	}



	enableSideScroll() {
		$('.kanban-board').on('wheel', (event) => {
				event.stopPropagation();
			})

		$(this.el).on('wheel', (event) => {
			this.el[0].scrollLeft += event.originalEvent.deltaY
			event.preventDefault();
		});
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
		  	console.warn("Could not load Kanban feed")
		  }
		});
		
	}

	renderBoards() {
		$(this.el).empty();
		Object.entries(this.boards).forEach((board) => {
			const [boardKey, boardValue] = board;

			const title = boardValue.title;
			const id = boardKey;

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

									var item = {
										itemId: itemId,
										itemData: this.items[itemId],
										itemEl: ui.item,
										newBoardId: boardKey,
										newBoardData: boardValue,
										newBoardEl: ui.item.parent().parent(),
									}

									this.onMove(item)
								}.bind(this)
							})
							.disableSelection()
							.click( this.onClick )
					])
				.appendTo(this.el);
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