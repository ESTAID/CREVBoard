  var mainInfoObj = {
    listElement: document.querySelector('#list'),
    mainElement: document.querySelector('#main'),
    writeAndEditElement: document.querySelector('#write'),
    writeButton: document.querySelector('#write-btn'),
    currHashLocation: 'Javascript',
    pagenationValue: 0,
    itemGet: function () {
      $.ajax({
          method: "GET",
          url: `http://13.125.111.35:58950/list?p=${this.pagenationValue}&category=${this.currHashLocation}`,
        })
        .done(function (data) {
          getLists(JSON.parse(data));
        });
    },
    valueUP: function () {
      this.pagenationValue++;
    }
  };
window.addEventListener('hashchange', function (ev) {
  mainInfoObj.currHashLocation = ev.target.location.hash.substring(1);
  var hashLists = [{
      key: 'list1',
      category: 'Javascript'
    },
    {
      key: 'list2',
      category: 'Algorithm'
    },
    {
      key: 'list3',
      category: 'DataStructure'
    },
    {
      key: 'list4',
      category: 'HTML/CSS'
    },
    {
      key: 'list5',
      category: 'Framework'
    }
  ];
  for (var i = 0; i < hashLists.length; i++) {
    if (mainInfoObj.currHashLocation === hashLists[i].key) {
      mainInfoObj.writeAndEditElement.style.display = 'none';
      mainInfoObj.listElement.style.display = 'block';
      mainInfoObj.mainElement.innerHTML = "";
      mainInfoObj.pagenationValue = 0;
      mainInfoObj.listElement.innerHTML = "";
      mainInfoObj.currHashLocation = hashLists[i].category;
      mainInfoObj.itemGet();
    }
  }
});
var getLists = function (arr) {
  for (var i = 0; i < arr.length; i++) {
    var itemParentElement = document.createElement('div');
    itemParentElement.classList.add('article-item', 'pure-g');
    itemParentElement.id = arr[i].b_idx;
    var itemElement = document.createElement('div');
    itemElement.classList.add('pure-u-3-4');
    var childNameElement = document.createElement('h5');
    childNameElement.classList.add('article-name');
    childNameElement.textContent = arr[i].m_name;
    var childSubjectElement = document.createElement('h4');
    childSubjectElement.classList.add('article-subject');
    childSubjectElement.textContent = arr[i].b_title;
    var childDescElement = document.createElement('p');
    childDescElement.classList.add('article-date');
    childDescElement.textContent = convertGMTToLocal(arr[i].b_regdate);
    mainInfoObj.listElement.appendChild(itemParentElement);
    itemParentElement.appendChild(itemElement);
    itemElement.appendChild(childNameElement);
    itemElement.appendChild(childSubjectElement);
    itemElement.appendChild(childDescElement);
  }
  mainInfoObj.valueUP();
};
var getBoard = function (arr) {
  mainInfoObj.mainElement.innerHTML = "";
  var headerParentElement = document.createElement('div');
  headerParentElement.classList.add('article-content');
  var headerElement = document.createElement('div');
  headerElement.classList.add('article-content-header', 'pure-g');
  var headerChildElement = document.createElement('div');
  headerChildElement.classList.add('pure-u-10-24');
  var headerChTitleElement = document.createElement('h1');
  headerChTitleElement.classList.add('article-content-title');
  headerChTitleElement.textContent = arr[0].b_title;
  var headerChSubElement = document.createElement('p');
  headerChSubElement.classList.add('article-content-subtitle');
  headerChSubElement.textContent = convertGMTToLocal(arr[0].b_regdate);
  mainInfoObj.mainElement.appendChild(headerParentElement);
  headerParentElement.appendChild(headerElement);
  headerElement.appendChild(headerChildElement);
  headerChildElement.appendChild(headerChTitleElement);
  headerChildElement.appendChild(headerChSubElement);
  var controlParentElement = document.createElement('div');
  controlParentElement.classList.add('article-content-controls', 'pure-u-1-2');
  var contolStarButton = document.createElement('button');
  contolStarButton.classList.add('secondary-button', 'pure-button');
  contolStarButton.textContent = 'Star';
  var controlEditButton = document.createElement('button');
  controlEditButton.classList.add('secondary-button', 'pure-button', 'boardInnerEdit');
  controlEditButton.textContent = 'Edit';
  var controlTrashButton = document.createElement('button');
  controlTrashButton.classList.add('secondary-button', 'pure-button', 'boardInnerTrash');
  controlTrashButton.textContent = 'Trash';
  mainInfoObj.mainElement.appendChild(controlParentElement);
  controlParentElement.appendChild(contolStarButton);
  controlParentElement.appendChild(controlEditButton);
  controlParentElement.appendChild(controlTrashButton);
  headerElement.appendChild(controlParentElement);
  controlParentElement.addEventListener('click', articleInnerButtonHandler);
  var bodyParentElement = document.createElement('div');
  bodyParentElement.classList.add('article-content-body');
  var converter = new showdown.Converter();
  var text = arr[0].b_contents;
  var html = converter.makeHtml(text);
  converter.setFlavor('github');
  showdown.setOption('tables', 'true');
  bodyParentElement.innerHTML = html;
  mainInfoObj.mainElement.appendChild(bodyParentElement);
  headerParentElement.appendChild(bodyParentElement);
  drawCommentsElement(mainInfoObj.mainElement, arr[0].m_name);
  headerParentElement.style.display = 'block';
  mainInfoObj.mainElement.style.display = 'block';
  $('pre').each(function (i, block) {
    hljs.highlightBlock(block);
  });
};
mainInfoObj.itemGet();
 
mainInfoObj.listElement.addEventListener('click', function (ev) {
  for (var i = 0; i < mainInfoObj.listElement.childElementCount; i++) {
    if (mainInfoObj.listElement.children[i].classList.contains('article-item-selected')) {
      mainInfoObj.listElement.children[i].classList.remove('article-item-selected');
    }
  }
  if (ev.target.parentNode.parentNode.classList[0] === 'article-item') {
    listClickHandler(ev.target.parentNode.parentNode);
  } else if (ev.target.parentNode.classList[0] === 'article-item') {
    listClickHandler(ev.target.parentNode);
  } else if (ev.target.classList[0] === 'article-item') {
    listClickHandler(ev.target);
  }
});

function listClickHandler(elem) {
  elem.classList.add('article-item-selected');
  var boardId = elem.id;
  $.ajax({
      method: "POST",
      url: "http://13.125.111.35:58950/read/" + boardId,
    })
    .done(function (data) {
      getBoard(JSON.parse(data));
    });
}
 
mainInfoObj.writeAndEditElement.style.display = 'none';
mainInfoObj.writeButton.addEventListener('click', function (ev) {
  ev.preventDefault();
  drawWriteElement();
  mainInfoObj.listElement.style.display = 'none';
  mainInfoObj.mainElement.style.display = 'none';
  mainInfoObj.writeAndEditElement.style.display = 'block';
  window.location.hash = '#write';
});
 
mainInfoObj.listElement.addEventListener('scroll', function (ev) {
  var scrollHeight = ev.target.scrollHeight;
  var scrollTop = ev.target.scrollTop;
  var clientHeight = ev.target.clientHeight;
  if (clientHeight + scrollTop >= scrollHeight) {
    mainInfoObj.itemGet();
  }
});
 
function removeInputValue(arr) {
  for (var i = 0; i < arr.length; i++) {
    var element = document.querySelector(arr[i]);
    element.value = "";
  }
}

function convertGMTToLocal(gmtTime) {
  var localDate = new Date(gmtTime);
  return localDate.toLocaleString();
}

function articleInnerButtonHandler(ev) {
  var lastClassName = ev.target.classList[ev.target.classList.length - 1];
  var boardId = document.querySelector('.article-item-selected').id;
  if (lastClassName === 'boardInnerEdit') {
    editClickHandler(boardId);
  } else if (lastClassName === 'boardInnerTrash') {
    deleteClickHandler(boardId);
  }
}

function deleteClickHandler(id) {
  if (window.confirm("Do you really want to delete?")) {
    $.ajax({
        method: "POST",
        url: "http://13.125.111.35:58950/delete/" + id,
      })
      .done(function (data) {
        if (JSON.parse(data).affectedRows === 1) {
          alert("comleted!");
          document.querySelector('.article-item-selected').remove();
          mainInfoObj.mainElement.innerHTML = "";
        } else {
          alert("failed");
        }
      });
  }
}

function editClickHandler(id) {
  $.ajax({
      method: "POST",
      url: "http://13.125.111.35:58950/read/" + id,
    })
    .done(function (data) {
      drawEditElement(JSON.parse(data));
    });
}

function drawEditElement(data) {
  var {
    b_title,
    b_idx,
    b_contents,
    b_category
  } = data[0];
  var txt =
    `<form class="pure-form">
		<fieldset class="pure-group write-form">
			<select id="state" class="w-category" >
				<option class="w-category-content" value="${b_category}" selected disabled>${b_category}</option>
	    </select>
		</fieldset>
	  <fieldset class="pure-group write-form">
	    <input type="text" class="pure-u-1 w-title" placeholder="Title" value="${b_title}"/>
	  </fieldset>
	  <fieldset class="pure-group write-form">
	    <textarea class="pure-u-1 w-contents" placeholder="Textareas work too" maxlength="65536" style="width: 100%; height: 600px;">${b_contents}</textarea>
	    <button id="editPost" class="secondary-button pure-button">edit</button>
	  </fieldset>
			<input type="hidden" class="w-idx" value="${b_idx}">
	</form>`;
  mainInfoObj.writeAndEditElement.innerHTML = txt;
  document.querySelector('#editPost').addEventListener('click', editPostButtonHandler);
  window.location.hash = '#edit';
  mainInfoObj.listElement.style.display = 'none';
  mainInfoObj.mainElement.style.display = 'none';
  mainInfoObj.writeAndEditElement.style.display = 'block';
}

function editPostButtonHandler(ev) {
  ev.preventDefault();
  if ($(".w-title").val() === "" || $(".w-contents").val() === "") {
    alert('Please check form');
  } else {
    var edit_data = {
      title: $(".w-title").val(),
      content: $(".w-contents").val(),
      id: $(".w-idx").val(),
      category: $(".w-category-content").val()
    };
    $.ajax({
        method: "POST",
        url: "http://13.125.111.35:58950/update/" + edit_data.id,
        data: edit_data,
        xhrFields: {
          withCredentials: true
        },
        crossDomain: true
      })
      .done(function (data) {
        if (JSON.parse(data).affectedRows === 1) {
          alert('성공');
          mainInfoObj.listElement.style.display = 'block';
          mainInfoObj.mainElement.innerHTML = "";
          mainInfoObj.writeAndEditElement.style.display = 'none';
          mainInfoObj.pagenationValue = 0;
          mainInfoObj.currHashLocation = edit_data.category;
          mainInfoObj.listElement.innerHTML = "";
          mainInfoObj.itemGet();
          removeInputValue([".w-category", ".w-title", ".w-contents", ".w-idx"]);
          removeeditElement();
        } else {
          alert('실패');
        }
      });
  }
}

function removeeditElement() {
  while (mainInfoObj.writeAndEditElement.firstChild) {
    mainInfoObj.writeAndEditElement.firstChild.remove();
  }
}

function removeWriteElement() {
  while (mainInfoObj.writeAndEditElement.firstChild) {
    mainInfoObj.writeAndEditElement.firstChild.remove();
  }
}

function drawWriteElement() {
  var txt =
    `<form class="pure-form">
		<fieldset class="pure-group write-form">
      <input id="remember" type="checkbox" style="display: inline-block;"> notice
      <div class="pure-g">
        <select id="state" class="pure-u-1-8 w-category">
          <option value="" selected disabled hidden>CATEGORY</option>
          <option>Javascript</option>
          <option>Algorithm</option>
          <option>DataStructure</option>
          <option>HTML/CSS</option>
          <option>Framework</option>
        </select>   
        <input type="text" class="pure-u-7-8 w-title" placeholder="Title" />
          
		  </div>
      <textarea class="pure-u-1 w-contents" placeholder="Textareas work too" maxlength="65536" style="width: 100%; height: 600px; margin-top:5px;"></textarea> 
      <div class="preview pure-u-1" style="max-height:600px;overflow:auto;max-width: 800px;"></div><br>
      <button id="writePost" class="primary-button pure-button pull-right">POST</button>  
      <button id="originPost" class="primary-button pure-button">TEXT</button> 
      <div id="previewPost" class="primary-button pure-button">PREVIEW</div> 
		  
	  </fieldset> 
	</form>`;
  mainInfoObj.writeAndEditElement.innerHTML = txt;
  document.querySelector('#writePost').addEventListener('click', writePostButtonHandler);
  document.querySelector('#originPost').addEventListener('click', function () {
    document.querySelector('.preview').style.display = 'none';
    document.querySelector('.w-contents').style.display = 'block';
  });
  document.querySelector('#previewPost').addEventListener('click', function () {
    document.querySelector('.preview').style.display = 'block';
    var converter = new showdown.Converter();
    var text = document.querySelector('.w-contents').value;
    var html = converter.makeHtml(text);
    converter.setFlavor('github');
    showdown.setOption('tables', 'true');
    document.querySelector('.preview').innerHTML = html;
    document.querySelector('.w-contents').style.display = 'none';
    //찾
  });
}

function writePostButtonHandler(ev) {
  ev.preventDefault();
  if ($(".w-category").val() === "" || $(".w-title").val() === "" || $(".w-contents").val() === "") {
    alert('Please check form');
  } else {
    var write_data = {
      category: $(".w-category").val(),
      title: $(".w-title").val(),
      contents: $(".w-contents").val()
    };
    $.ajax({
        method: "POST",
        url: "http://13.125.111.35:58950/write",
        data: write_data,
        xhrFields: {
          withCredentials: true
        },
        crossDomain: true
      })
      .done(function (data) {
        if (data.result === 'success') {
          alert('성공');
          mainInfoObj.listElement.style.display = 'block';
          mainInfoObj.mainElement.innerHTML = "";
          mainInfoObj.writeAndEditElement.style.display = 'none';
          mainInfoObj.pagenationValue = 0;
          mainInfoObj.currHashLocation = write_data.category;
          mainInfoObj.listElement.innerHTML = "";
          mainInfoObj.itemGet();
          removeInputValue([".w-category", ".w-title", ".w-contents"]);
          removeWriteElement();
        } else {
          alert('실패');
        }
      });
  }
}

function drawCommentsElement(parentElem, username) {
  var commentsElement = document.createElement('div');
  commentsElement.classList.add('pure-g', 'comments');
  var commentsInnerHeaderElement = document.createElement('div');
  commentsInnerHeaderElement.classList.add('pure-u-1', 'comments-header');
  var headerInnerTitleElement = document.createElement('h5');
  headerInnerTitleElement.classList.add('comments-header-title');
  headerInnerTitleElement.textContent = 'comments';
  var headerInnerCountElement = document.createElement('span');
  headerInnerCountElement.textContent = '10(Json값)';
  var headerInnerReloadElement = document.createElement('button');
  headerInnerReloadElement.textContent = 'reload';

  commentsInnerHeaderElement.appendChild(headerInnerTitleElement);
  commentsInnerHeaderElement.appendChild(headerInnerCountElement);

  var commentsInnerBodyElement = document.createElement('div');
  commentsInnerBodyElement.classList.add('pure-u-23-24', 'comments-body');
  var bodyInnerFormElement = document.createElement('form');
  bodyInnerFormElement.classList.add('pure-form');
  var bodyInnerFieldsetElement = document.createElement('fieldset');
  var fieldsetInnerProfileElement = document.createElement('div');
  fieldsetInnerProfileElement.classList.add('comments-body-profile');
  var profileInnerNameElement = document.createElement('span');
  profileInnerNameElement.classList.add('comments-body-profile-name');
  profileInnerNameElement.textContent = username;
  var fieldsetInnerWriteElement = document.createElement('div');
  fieldsetInnerWriteElement.classList.add('comments-body-write');
  var writeInnerFormElement = document.createElement('textarea');
  writeInnerFormElement.rows = 3;
  writeInnerFormElement.cols = 30;
  writeInnerFormElement.placeholder = '최대 300자 까지 작성 가능합니다';
  writeInnerFormElement.classList.add('comments-body-write-form');
  var currContent;
  var writeInnerCountElement = document.createElement('div');
  writeInnerCountElement.classList.add('pure-u-23-24', 'comments-body-write-count');
  var writeInnerCountNumElement = document.createElement('strong');
  writeInnerCountNumElement.id = 'write-count';
  writeInnerCountNumElement.textContent = '0';
  var writeInnerCountTotalElement = document.createElement('strong');
  writeInnerCountTotalElement.id = 'write-count-total';
  writeInnerCountTotalElement.textContent = ' / 300';

  writeInnerCountElement.appendChild(writeInnerCountNumElement);
  writeInnerCountElement.appendChild(writeInnerCountTotalElement);

  var commentsInnerFooterElement = document.createElement('div');
  commentsInnerFooterElement.classList.add('pure-u-23-24', 'comments-submit');
  var footerInnerSubmitElement = document.createElement('button');
  footerInnerSubmitElement.classList.add('primary-button', 'pure-button', 'pull-right');
  footerInnerSubmitElement.textContent = 'submit';
  commentsInnerFooterElement.appendChild(footerInnerSubmitElement);
  commentsInnerBodyElement.appendChild(bodyInnerFormElement);

  var commentsInnerListElement = document.createElement('div');
  commentsInnerListElement.classList.add('pure-u-23-24', 'comments-list');
  var ListInnerListElement = document.createElement('ul');
  ListInnerListElement.classList.add('list-inner-list');
  commentsInnerListElement.appendChild(ListInnerListElement);

  bodyInnerFormElement.appendChild(bodyInnerFieldsetElement);
  bodyInnerFieldsetElement.appendChild(fieldsetInnerProfileElement);
  bodyInnerFieldsetElement.appendChild(fieldsetInnerWriteElement);
  bodyInnerFieldsetElement.appendChild(writeInnerCountElement);

  fieldsetInnerProfileElement.appendChild(profileInnerNameElement);
  fieldsetInnerWriteElement.appendChild(writeInnerFormElement);

  commentsElement.appendChild(commentsInnerHeaderElement);
  commentsElement.appendChild(commentsInnerBodyElement);
  commentsElement.appendChild(commentsInnerFooterElement);
  commentsElement.appendChild(commentsInnerListElement);
  parentElem.appendChild(commentsElement);

  writeInnerFormElement.addEventListener('keyup', commentsLetterCount);
  footerInnerSubmitElement.addEventListener('click', commentsClickHandler);

}

function commentsLetterCount(ev) {
  var writeCountElement = document.querySelector('#write-count');
  var currLength = ev.target.value.length;
  writeCountElement.textContent = currLength;
  if (currLength >= 300) {
    alert("글자수를 초과하였습니다.");
    ev.target.value = currContent;
    writeCountElement.textContent = currLength - 1;
  } else {
    currContent = ev.target.value;
    console.log(currContent);
  }
}

function commentsClickHandler() {
  var parentElement = document.querySelector('.list-inner-list');
  var commentsContent = document.querySelector('.comments-body-write-form').value;
  var commentsUserName = document.querySelector('.comments-body-profile-name').textContent;
  var commentsListElement = document.createElement('li');
  var listInnerAreaElement = document.createElement('div');
  listInnerAreaElement.classList.add('list-area');
  var areaInnerInfoElement = document.createElement('div');
  var infoInnrNameElement = document.createElement('span');
  infoInnrNameElement.textContent = commentsUserName;
  var infoInnerTimeElement = document.createElement('span');
  infoInnerTimeElement.textContent = new Date();

  var areaInnerWrapElement = document.createElement('div');
  var wrapInnerContentElement = document.createElement('span');
  wrapInnerContentElement.textContent = commentsContent;


  commentsListElement.appendChild(listInnerAreaElement);
  listInnerAreaElement.appendChild(areaInnerInfoElement);
  listInnerAreaElement.appendChild(areaInnerWrapElement);
  areaInnerInfoElement.appendChild(infoInnrNameElement);
  areaInnerInfoElement.appendChild(infoInnerTimeElement);
  areaInnerWrapElement.appendChild(wrapInnerContentElement);
  parentElement.appendChild(commentsListElement);
}