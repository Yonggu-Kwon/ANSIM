;(function ($) {
    'use strict';

    $.SWDatatables = {
        defaults: {
            paging: true,
            info: {
                currentInterval: null,
                totalQty: null,
                divider: ' to '
            },

            isSelectable: false,
            isColumnsSearch: false,
            isColumnsSearchTheadAfter: false,

            pagination: null,
            paginationClasses: 'pagination datatable-custom-pagination',
            paginationLinksClasses: 'page-link',
            paginationItemsClasses: 'page-item',
            paginationPrevClasses: 'page-item',
            paginationPrevLinkClasses: 'page-link',
            paginationPrevLinkMarkup: '<span aria-hidden="true">Prev</span>',
            paginationNextClasses: 'page-item',
            paginationNextLinkClasses: 'page-link',
            paginationNextLinkMarkup: '<span aria-hidden="true">Next</span>',
            detailsInvoker: null,
            select: null
        },

        init: function (el, options) {
            if (!el.length) return;

            var context = this,
                defaults = Object.assign({}, context.defaults),
                dataSettings = el.attr('data-sw-datatables-options') ? JSON.parse(el.attr('data-sw-datatables-options')) : {},
                settings = {};
            settings = $.extend(defaults, settings, dataSettings, options);

            /* Start : Init */

            var newDataTable = el.DataTable(settings);

            /* End : Init */

            /* Start : custom functionality implementation */

            var api = new $.fn.dataTable.Api(el),
                customDraw = function () {
                    var info = api.page.info(),
                        $initPagination = $('#' + api.context[0].nTable.id + '_paginate'),
                        $initPaginationPrev = $initPagination.find('.paginate_button.previous'),
                        $initPaginationNext = $initPagination.find('.paginate_button.next'),
                        $initPaginationLink = $initPagination.find('.paginate_button:not(.previous):not(.next), .ellipsis');

                    $initPaginationPrev.wrap('<span class="' + settings.paginationItemsClasses + '"></span>');
                    $initPaginationPrev.addClass(settings.paginationPrevLinkClasses).html(settings.language.paginate.previous);
                    $initPaginationNext.wrap('<span class="' + settings.paginationItemsClasses + '"></span>');
                    $initPaginationNext.addClass(settings.paginationNextLinkClasses).html(settings.language.paginate.next);
                    $initPaginationPrev.unwrap($initPaginationPrev.parent()).wrap('<li class="paginate_item ' + settings.paginationItemsClasses + '"></li>');
                    if ($initPaginationPrev.hasClass('disabled')) {
                        $initPaginationPrev.removeClass('disabled');
                        $initPaginationPrev.parent().addClass('disabled');
                    }
                    $initPaginationNext.unwrap($initPaginationNext.parent()).wrap('<li class="paginate_item ' + settings.paginationItemsClasses + '"></li>');
                    if ($initPaginationNext.hasClass('disabled')) {
                        $initPaginationNext.removeClass('disabled');
                        $initPaginationNext.parent().addClass('disabled');
                    }
                    $initPaginationLink.unwrap($initPaginationLink.parent());
                    $initPaginationLink.each(function () {
                        if ($(this).hasClass('current')) {
                            $(this).removeClass('current');
                            $(this).wrap('<li class="paginate_item ' + settings.paginationItemsClasses + ' active' + '"></li>');
                        } else {
                            $(this).wrap('<li class="paginate_item ' + settings.paginationItemsClasses + '"></li>');
                        }
                    });
                    $initPaginationLink.addClass(settings.paginationLinksClasses);
                    $initPagination.prepend('<ul id="' + api.context[0].nTable.id + '_pagination' + '" class="' + settings.paginationClasses + '"></ul>');
                    $initPagination.find('.paginate_item').appendTo('#' + api.context[0].nTable.id + '_pagination');

                    if (settings.serverSide && info.pages <= 1) {
                        $('#' + settings.pagination).hide();
                    } else {
                        $('#' + settings.pagination).show();
                    }

                    if (settings.info.currentInterval) {
                        $(settings.info.currentInterval).html((info.start + 1) + settings.info.divider + info.end);
                    }

                    if (settings.info.totalQty) {
                        let elem = $(settings.info.totalQty);
                        if(elem.length > 0) {
                            elem.html(info.recordsDisplay);
                        }
                    }

                    if (settings.scrollY) {
                        el.find($('.dataTables_scrollBody thead tr')).css({visibility:'hidden'});
                    }

                    if(settings.select.classMap) {
                        $(settings.select.classMap.checkAll).prop('checked', false);
                        $(settings.select.classMap.counterInfo).hide();
                    }
                };

            customDraw();

            newDataTable.on('draw', customDraw);

            // Custom pagination
            context.customPagination(el, newDataTable, settings);

            // Custom search
            context.customSearch(el, newDataTable, settings);

            // Custom columns search
            if (settings.isColumnsSearch) context.customColumnsSearch(el, newDataTable, settings);

            // Custom entries
            context.customEntries(el, newDataTable, settings);

            // Row checking
            if (settings.isSelectable) context.rowChecking(el);

            // Details
            context.details(el, settings.detailsInvoker, newDataTable);

            // Select All
            if (settings.select) context.select(settings.select, newDataTable);

            /* End : custom functionality implementation */

            return newDataTable;
        },

        // ----- Start : Custom functionality -----

        customPagination: function (el, initEl, params) {
            var settings = params;

            $('#' + settings.pagination).append($('#' + initEl.context[0].nTable.id + '_paginate'));
        },

        customSearch: function (el, initEl, params) {
            var settings = params;

            $(settings.search).on('keyup', function () {
                initEl.search(this.value).draw();
            });
        },

        customColumnsSearch: function (el, initEl, params) {
            var settings = params;

            initEl.columns().every(function () {
                var that = this;

                if (settings.isColumnsSearchTheadAfter) {
                    $('.dataTables_scrollFoot').insertAfter('.dataTables_scrollHead');
                }

                $('input', this.footer()).on('keyup change', function () {
                    if (that.search() !== this.value) {
                        that.search(this.value).draw();
                    }
                });

                $('select', this.footer()).on('change', function () {
                    if (that.search() !== this.value) {
                        that.search(this.value).draw();
                    }
                });
            });
        },

        customEntries: function (el, initEl, params) {
            var settings = params;

            $(settings.entries).on('change', function () {
                var val = $(this).val();

                initEl.page.len(val).draw();
            });
        },

        rowChecking: function (el) {
            $(el).on('change', 'input', function () {
                $(this).parents('tr').toggleClass('checked');
            });
        },

        format: function (value) {
            return value;
        },

        details: function (el, invoker, table) {
            if (!invoker) return;

            //Variables
            var $self = this;

            $(el).on('click', invoker, function () {
                var tr = $(this).closest('tr'),
                    row = table.row(tr);

                if (row.child.isShown()) {
                    row.child.hide();
                    tr.removeClass('opened');
                } else {
                    row.child($self.format(tr.data('details'))).show();
                    tr.addClass('opened');
                }
            });
        },

        select: function (select, table) {
            $(select.classMap.checkAll).off('click').on('click', function () {
                if ($(this).is(':checked')) {
                    table.rows({ page: 'current' }).select();
                    table.rows({ page: 'current' }).nodes().each(function (el) {
                        $(el).find(select.selector).prop('checked', true);
                    });
                } else {
                    table.rows({ page: 'current' }).deselect();
                    table.rows({ page: 'current' }).nodes().each(function (el) {
                        $(el).find(select.selector).prop('checked', false);
                    });
                }

                let allRows = table.rows({ page: 'current' }).data();
                let selRows = table.rows({ page: 'current', selected: true }).data();
                let notRows = table.rows('.not-selectable', { page: 'current', selected: false}).data();

                console.log("allRows = " + allRows.length + ", selRows = " + selRows.length + ", notRows = " + notRows.length);

                if (allRows.length !== (selRows.length + notRows.length)) {
                    $(select.classMap.checkAll).prop('checked', false);
                } else {
                    if(allRows.length !== 0 && (allRows.length !== notRows.length)) {
                        $(select.classMap.checkAll).prop('checked', true);
                    }
                }

                if (table.rows('.selected').data().length === 0) {
                    $(select.classMap.counterInfo).hide();
                } else {
                    $(select.classMap.counterInfo).show();
                }
            });

            table.on('select', function () {
                $(select.classMap.counter).text(table.rows({ page: 'current', selected: true}).data().length);

                let allRows = table.rows({ page: 'current' }).data();
                let selRows = table.rows({ page: 'current', selected: true }).data();
                let notRows = table.rows('.not-selectable', { page: 'current', selected: false}).data();

                console.log("allRows = " + allRows.length + ", selRows = " + selRows.length + ", notRows = " + notRows.length);

                if (allRows.length !== (selRows.length + notRows.length)) {
                    $(select.classMap.checkAll).prop('checked', false);
                } else {
                    if(allRows.length !== 0 && (allRows.length !== notRows.length)) {
                        $(select.classMap.checkAll).prop('checked', true);
                    }
                }

                if (table.rows('.selected').data().length === 0) {
                    $(select.classMap.counterInfo).hide();
                } else {
                    $(select.classMap.counterInfo).show();
                }
            }).on('deselect', function () {
                $(select.classMap.counter).text(table.rows({ page: 'current', selected: true}).data().length);

                let allRows = table.rows({ page: 'current' }).data();
                let selRows = table.rows({ page: 'current', selected: true }).data();
                let notRows = table.rows('.not-selectable', { page: 'current', selected: false}).data();

                console.log("allRows = " + allRows.length + ", selRows = " + selRows.length + ", notRows = " + notRows.length);

                if (allRows.length !== (selRows.length + notRows.length)) {
                    $(select.classMap.checkAll).prop('checked', false);
                } else {
                    if(allRows.length !== 0 && (allRows.length !== notRows.length)) {
                        $(select.classMap.checkAll).prop('checked', true);
                    }
                }

                if (table.rows('.selected').data().length === 0) {
                    $(select.classMap.counterInfo).hide();
                } else {
                    $(select.classMap.counterInfo).show();
                }
            });
        }

        // ----- End : Custom functionality -----
    };

})(jQuery);
