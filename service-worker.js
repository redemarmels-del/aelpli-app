const CACHE_NAME = "aelpli-app-v3";
2
 
3
const FILES_TO_CACHE = [
4
"./index.html",
5
"./manifest.json"
6
];
7
 
8
self.addEventListener("install", event => {
9
self.skipWaiting();
10
 
11
event.waitUntil(
12
caches.open(CACHE_NAME).then(cache => {
13
return cache.addAll(FILES_TO_CACHE);
14
})
15
);
16
});
17
 
18
self.addEventListener("activate", event => {
19
event.waitUntil(
20
caches.keys().then(keys => {
21
return Promise.all(
22
keys
23
.filter(key => key !== CACHE_NAME)
24
.map(key => caches.delete(key))
25
);
26
})
27
);
28
 
29
self.clients.claim();
30
});
31
 
32
self.addEventListener("fetch", event => {
33
 
34
// Bei HTML immer zuerst Internet versuchen
35
if (event.request.mode === "navigate") {
36
event.respondWith(
37
fetch(event.request)
38
.then(response => {
39
const copy = response.clone();
40
 
41
caches.open(CACHE_NAME).then(cache => {
42
cache.put("./index.html", copy);
43
});
44
 
45
return response;
46
})
47
.catch(() => {
48
return caches.match("./index.html");
49
})
50
);
51
 
52
return;
53
}
54
 
55
// Andere Dateien: Internet zuerst, Cache als Fallback
56
event.respondWith(
57
fetch(event.request)
58
.then(response => {
59
const copy = response.clone();
60
 
61
caches.open(CACHE_NAME).then(cache => {
62
cache.put(event.request, copy);
63
});
64
 
65
return response;
66
})
67
.catch(() => caches.match(event.request))
68
);
69
});
