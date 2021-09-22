class Kanban {
	constructor(el, args) {
		this.el = el;
		this.args = args;
		if (Array.isArray(args.boards)) {
			this.boards = {};
			args.boards.forEach((board, boardIndex) => {
				this.boards[boardIndex] = board;
			});
		} else {
			this.boards = args.boards;
		}

		this.items = args.items;

		//add css class to div
		$(this.el).addClass("kanban-container");

		//render the boards
		this.renderBoards();

		if (this.args.enableScroll === undefined || this.args.enableScroll) {
			this.enableSideScroll();
		}

		//render the Initial Items
		if (this.args.itemFeed) {
			this.readFeed();
		} else {
			this.addItems(this.items);
		}
	}

	addItems(items) {
		items.forEach((item, itemId) => {
			this.addItem(item, itemId);
		});
	}

	addItem(item, itemId) {
		const title = item.title;
		const boardID = item.boardId;
		const description = item.description;
		const image = item.image;
		let divContent = [];

		if (image) {
			divContent.push($("<img>").attr("src", image)[0]);
		}

		if (description) {
			divContent.push($("<h3></h3>").text(title)[0]);
			divContent.push($("<span></span>").text(description)[0]);
		} else {
			divContent.push($("<span></span>").text(title)[0]);
		}

		let itemDiv = $("<div></div>")
			.addClass("kanban-item")
			.data("id", itemId)
			.css("background-color", item.color)
			.html(divContent)
			.appendTo("#" + boardID + " > .kanban-items-container");
			if (this.args.onRenderItem) {
				this.args.onRenderItem(itemDiv[0], item);
			}
	}

	enableSideScroll() {
		$(".kanban-board").on("wheel", (event) => {
			event.stopPropagation();
		});

		$(this.el).on("wheel", (event) => {
			this.el[0].scrollLeft += event.originalEvent.deltaY;
			event.preventDefault();
		});
	}

	readFeed() {
		$.ajax({
			url: this.args.itemFeed,
			type: "GET",
			dataType: "xml/html/script/json/jsonp",
			success: function (data, textStatus, xhr) {
				this.items = data;
				this.addItems(this.items);
			},
			error: function (xhr, textStatus, errorThrown) {
				console.warn("Could not load Kanban feed");
			},
		});
	}

	renderBoards() {
		$(this.el).empty();
		Object.entries(this.boards).forEach((board) => {
			const [boardId, boardData] = board;

			const title = boardData.title;
			const id = boardId;

			$("<div></div>")
				.addClass("kanban-board")
				.attr("id", id)
				.css("background-color", boardData.color)
				.html([
					$("<div></div>").addClass("kanban-title").html(title),
					$("<div></div>")
						.addClass("kanban-items-container")
						.sortable({
							placeholder: "sortable-placeholder",
							opacity: 1,
							sort: function (event, ui) {
								$(".sortable-placeholder").css(
									"height",
									ui.item.outerHeight()
								);
							},
							connectWith: ".kanban-items-container",
							stop: function (event, ui) {
								var itemId = ui.item.data("id");

								var newIndex = ui.item.index();
								var newBoard = ui.item
									.parent()
									.parent()
									.attr("id");
								var error;

								try {
									this.items[itemId].boardId = newBoard;
								} catch (err) {
									error = err;
								}

								var item = {
									itemId: itemId,
									itemData: this.items[itemId],
									itemEl: ui.item,
									newBoardId: newBoard,
									newBoardData: this.boards[newBoard],
									newBoardEl: ui.item.parent().parent(),
								};

								this.args.onMove(item, error);
							}.bind(this),
						})
						.accordion()
						.disableSelection()
						.click((evt) => {
							this.args.onClick({
								itemId: $(evt.target).data("id"),
								itemData: this.items[$(evt.target).data("id")],
								itemEl: $(evt.target),
							});
						}),
				])
				.appendTo(this.el);
		});
	}
}
