class Kanban {
	constructor(el, args) {
		this.kanbanEL = el;
		this.boards = args.boards;
		this.items = args.items;

		//add css class to div
		$(this.kanbanEL).addClass('kanban-container');

		//render the boards
		this.renderBoards();
	}

	renderBoards() {
		this.boards.forEach((board) => {
			const title = board.title;
			const id = board.id;

			$('<div></div>')
				.addClass('kanban-board')
				.attr("id", id)
				.html([
						$('<div></div>').addClass('kanban-title').html(title),
						$('<div></div>').addClass('kanban-items-container').sortable({
						      connectWith: ".kanban-items-container"
						    }).disableSelection()
					])
				.appendTo(this.kanbanEL);
		});

		this.renderItems()
	}

	renderItems() {
		this.items.forEach((item) => {
			const title = item.title;
			const boardID = item.boardId;

			$('<div></div>').addClass('kanban-item')
				.html(
					title
				).appendTo("#" + boardID + " > .kanban-items-container");

		});
	}



}

/*
	Args:

	{
		"boards": [
			{"id": <boardID>, "title": <title>},
			{"id": <boardID>, "title": <title>},
			{"id": <boardID>, "title": <title>}
		]
		"items": [
			{"boardId": <boardID>, "title": <title>},
			{"boardId": <boardID>, "title": <title>},
			{"boardId": <boardID>, "title": <title>}
		]
	}
*/
