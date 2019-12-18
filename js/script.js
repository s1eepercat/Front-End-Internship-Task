//init selectors
const sidebar = document.querySelector('.sidebar');
const main = document.querySelector('main');

const auth = document.querySelector('.author');
const wd = document.querySelector('.width');
const ht = document.querySelector('.height');


//calculate the biggest image size we need to download depending on our screen size
const resizedImageUrl = (originalUrl, w, h) => {
	const ratio = w / h;
	let goalH;
	let goalW;

	if (main.offsetWidth > main.offsetHeight) {
		//if screen is horizonal
		goalH = main.offsetHeight;
		goalW = Math.round(goalH * ratio);
	} else {
		//if screen is vertical
		goalW = main.offsetWidth;
		goalH = Math.round(goalW / ratio);
	}

	let optimizedUrl = originalUrl.slice(0, -9) + `${goalW}/${goalH}`;

	return optimizedUrl;
}


//display an image with it's details on the right side
const displayImage = (url, a, w, h) => {

	main.style.backgroundImage = `url(${resizedImageUrl(url, w, h)})`;		//download resized image that fit your screen precisely
	console.log(resizedImageUrl(url, w, h));

	// main.style.backgroundImage = `url(${url})`; 							//download original huge size pictures
	// console.log(url);


	auth.textContent = `Author: ${a}`;
	wd.textContent = `Width: ${w} px`;
	ht.textContent = `Height: ${h} px`;

}


//fetch data
fetch('https://picsum.photos/v2/list')
	.then(resp => resp.json())
	.then(urls => {

		//showing the first image straight away, disabling this line will leave right side blank before selecting any images
		displayImage(urls[0].download_url, urls[0].author, urls[0].width, urls[0].height);

		//passing data further
		return urls;
	})
	.then(urls => urls.map(url => {

		//creating img elements and pushing them into a sidebar
		let img = document.createElement("img");
		sidebar.appendChild(img);

		//slicing the original resolution part from url and adding a small size
		let smallImg = url.download_url.slice(0, -9) + '200/200';
		img.src = smallImg;

		//add onclick event to each image
		img.addEventListener('click', () => {
			displayImage(url.download_url, url.author, url.width, url.height);
		});

	}))
	.catch(console.log);