var __accessCheck = (obj, member, msg) => {
  if (!member.has(obj))
    throw TypeError("Cannot " + msg);
};
var __privateGet = (obj, member, getter) => {
  __accessCheck(obj, member, "read from private field");
  return getter ? getter.call(obj) : member.get(obj);
};
var __privateAdd = (obj, member, value) => {
  if (member.has(obj))
    throw TypeError("Cannot add the same private member more than once");
  member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
};
var __privateSet = (obj, member, value, setter) => {
  __accessCheck(obj, member, "write to private field");
  setter ? setter.call(obj, value) : member.set(obj, value);
  return value;
};
var __privateMethod = (obj, member, method) => {
  __accessCheck(obj, member, "access private method");
  return method;
};
var _e2, _t2, _s, s_fn, _r, r_fn, _e3, _t3, _s2, _r2, _i, _n, _o, _a, _c, _l, l_fn, _u, u_fn, _h, h_fn, _e4, _t4, _s3, _r3, _i2, _n2, n_fn, _o2, o_fn, _a2, a_fn, _c2, c_fn, _l2, l_fn2, _u2, u_fn2, _h2, h_fn2, _d, d_fn, _p, p_fn, _f, f_fn, _m, m_fn, _w, w_fn;
const p = function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(script) {
    const fetchOpts = {};
    if (script.integrity)
      fetchOpts.integrity = script.integrity;
    if (script.referrerpolicy)
      fetchOpts.referrerPolicy = script.referrerpolicy;
    if (script.crossorigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (script.crossorigin === "anonymous")
      fetchOpts.credentials = "omit";
    else
      fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
};
p();
var style = "";
const me = async (t, { pluginPath: e, pluginName: r }, s) => {
  s == null ? void 0 : s.tracker.setCaption(`Activating ${r || e}`);
  const n = [
    `${await t.documentRoot}/wp-load.php`,
    `${await t.documentRoot}/wp-admin/includes/plugin.php`
  ];
  if (!n.every(
    (a) => t.fileExists(a)
  ))
    throw new Error(
      `Required WordPress files do not exist: ${n.join(", ")}`
    );
  if ((await t.run({
    code: `<?php
define( 'WP_ADMIN', true );
${n.map((a) => `require_once( '${a}' );`).join(`
`)}
$plugin_path = '${e}';
if (!is_dir($plugin_path)) {
	activate_plugin($plugin_path);
	return;
}
// Find plugin entry file
foreach ( ( glob( $plugin_path . '/*.php' ) ?: array() ) as $file ) {
	$info = get_plugin_data( $file, false, false );
	if ( ! empty( $info['Name'] ) ) {
		activate_plugin( $file );
		return;
	}
}
echo 'NO_ENTRY_FILE';
`
  })).text.endsWith("NO_ENTRY_FILE"))
    throw new Error("Could not find plugin entry file.");
}, we = async (t, { themeFolderName: e }, r) => {
  r == null ? void 0 : r.tracker.setCaption(`Activating ${e}`);
  const s = `${await t.documentRoot}/wp-load.php`;
  if (!t.fileExists(s))
    throw new Error(
      `Required WordPress file does not exist: ${s}`
    );
  await t.run({
    code: `<?php
define( 'WP_ADMIN', true );
require_once( '${s}' );
switch_theme( '${e}' );
`
  });
};
function O(t) {
  const e = t.split(".").shift().replace(/-/g, " ");
  return e.charAt(0).toUpperCase() + e.slice(1).toLowerCase();
}
async function R(t, e, r) {
  let s = "";
  await t.fileExists(e) && (s = await t.readFileAsText(e)), await t.writeFile(e, r(s));
}
async function Le(t) {
  return new Uint8Array(await t.arrayBuffer());
}
class Oe extends File {
  constructor(e, r) {
    super(e, r), this.buffers = e;
  }
  async arrayBuffer() {
    return this.buffers[0];
  }
}
const M = File.prototype.arrayBuffer instanceof Function ? File : Oe, J = "/vfs-blueprints", z = async (t, { consts: e, virtualize: r = false }) => {
  const s = await t.documentRoot, n = r ? J : s, i = `${n}/playground-consts.json`, o = `${n}/wp-config.php`;
  return r && (t.mkdir(J), t.setPhpIniEntry("auto_prepend_file", o)), await R(
    t,
    i,
    (a) => JSON.stringify({
      ...JSON.parse(a || "{}"),
      ...e
    })
  ), await R(t, o, (a) => a.includes("playground-consts.json") ? a : `<?php
	$consts = json_decode(file_get_contents('${i}'), true);
	foreach ($consts as $const => $value) {
		if (!defined($const)) {
			define($const, $value);
		}
	}
?>${a}`), o;
}, Ne = async (t, e) => {
  const r = new Ue(
    t,
    e.wordpressPath || "/wordpress",
    e.siteUrl
  );
  e.addPhpInfo === true && await r.addPhpInfo(), e.siteUrl && await r.patchSiteUrl(), e.patchSecrets === true && await r.patchSecrets(), e.disableSiteHealth === true && await r.disableSiteHealth(), e.disableWpNewBlogNotification === true && await r.disableWpNewBlogNotification();
};
class Ue {
  constructor(e, r, s) {
    this.php = e, this.scopedSiteUrl = s, this.wordpressPath = r;
  }
  async addPhpInfo() {
    await this.php.writeFile(
      `${this.wordpressPath}/phpinfo.php`,
      "<?php phpinfo(); "
    );
  }
  async patchSiteUrl() {
    await z(this.php, {
      consts: {
        WP_HOME: this.scopedSiteUrl,
        WP_SITEURL: this.scopedSiteUrl
      },
      virtualize: true
    });
  }
  async patchSecrets() {
    await R(
      this.php,
      `${this.wordpressPath}/wp-config.php`,
      (e) => `<?php
					define('AUTH_KEY',         '${P(40)}');
					define('SECURE_AUTH_KEY',  '${P(40)}');
					define('LOGGED_IN_KEY',    '${P(40)}');
					define('NONCE_KEY',        '${P(40)}');
					define('AUTH_SALT',        '${P(40)}');
					define('SECURE_AUTH_SALT', '${P(40)}');
					define('LOGGED_IN_SALT',   '${P(40)}');
					define('NONCE_SALT',       '${P(40)}');
				?>${e.replaceAll("', 'put your unique phrase here'", "__', ''")}`
    );
  }
  async disableSiteHealth() {
    await R(
      this.php,
      `${this.wordpressPath}/wp-includes/default-filters.php`,
      (e) => e.replace(
        /add_filter[^;]+wp_maybe_grant_site_health_caps[^;]+;/i,
        ""
      )
    );
  }
  async disableWpNewBlogNotification() {
    await R(
      this.php,
      `${this.wordpressPath}/wp-config.php`,
      (e) => `${e} function wp_new_blog_notification(...$args){} `
    );
  }
}
function P(t) {
  const e = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()_+=-[]/.,<>?";
  let r = "";
  for (let s = t; s > 0; --s)
    r += e[Math.floor(Math.random() * e.length)];
  return r;
}
const He = async (t, { code: e }) => await t.run({ code: e }), We = async (t, { options: e }) => await t.run(e), Ie = async (t, { key: e, value: r }) => {
  await t.setPhpIniEntry(e, r);
}, Me = async (t, { request: e }) => await t.request(e), ze = async (t, { fromPath: e, toPath: r }) => {
  await t.writeFile(
    r,
    await t.readFileAsBuffer(e)
  );
}, De = async (t, { fromPath: e, toPath: r }) => {
  await t.mv(e, r);
}, qe = async (t, { path: e }) => {
  await t.mkdir(e);
}, je = async (t, { path: e }) => {
  await t.unlink(e);
}, Be = async (t, { path: e }) => {
  await t.rmdir(e);
}, ge = async (t, { path: e, data: r }) => {
  r instanceof File && (r = await Le(r)), await t.writeFile(e, r);
}, Ve = async (t, { siteUrl: e }) => await z(t, {
  consts: {
    WP_HOME: e,
    WP_SITEURL: e
  }
});
class ye {
  constructor({ concurrency: e }) {
    this._running = 0, this.concurrency = e, this.queue = [];
  }
  get running() {
    return this._running;
  }
  async acquire() {
    for (; ; )
      if (this._running >= this.concurrency)
        await new Promise((e) => this.queue.push(e));
      else {
        this._running++;
        let e = false;
        return () => {
          e || (e = true, this._running--, this.queue.length > 0 && this.queue.shift()());
        };
      }
  }
  async run(e) {
    const r = await this.acquire();
    try {
      return await e();
    } finally {
      r();
    }
  }
}
const Ge = Symbol("literal");
function S(t) {
  if (typeof t == "string")
    return t.startsWith("$") ? t : JSON.stringify(t);
  if (typeof t == "number")
    return t.toString();
  if (Array.isArray(t))
    return `array(${t.map(S).join(", ")})`;
  if (t === null)
    return "null";
  if (typeof t == "object")
    return Ge in t ? t.toString() : `array(${Object.entries(t).map(([r, s]) => `${JSON.stringify(r)} => ${S(s)}`).join(", ")})`;
  if (typeof t == "function")
    return t();
  throw new Error(`Unsupported value: ${t}`);
}
function D(t) {
  const e = {};
  for (const r in t)
    e[r] = S(t[r]);
  return e;
}
const Z = `<?php

function zipDir($dir, $output, $additionalFiles = array())
{
    $zip = new ZipArchive;
    $res = $zip->open($output, ZipArchive::CREATE);
    if ($res === TRUE) {
        foreach ($additionalFiles as $file) {
            $zip->addFile($file);
        }
        $directories = array(
            rtrim($dir, '/') . '/'
        );
        while (sizeof($directories)) {
            $dir = array_pop($directories);

            if ($handle = opendir($dir)) {
                while (false !== ($entry = readdir($handle))) {
                    if ($entry == '.' || $entry == '..') {
                        continue;
                    }

                    $entry = $dir . $entry;

                    if (is_dir($entry)) {
                        $directory_path = $entry . '/';
                        array_push($directories, $directory_path);
                    } else if (is_file($entry)) {
                        $zip->addFile($entry);
                    }
                }
                closedir($handle);
            }
        }
        $zip->close();
        chmod($output, 0777);
    }
}

function unzip($zipPath, $extractTo, $overwrite = true)
{
    if(!is_dir($extractTo)) {
        mkdir($extractTo, 0777, true);
    }
    $zip = new ZipArchive;
    $res = $zip->open($zipPath);
    if ($res === TRUE) {
        $zip->extractTo($extractTo);
        $zip->close();
        chmod($extractTo, 0777);
    }
}


function delTree($dir)
{
    $files = array_diff(scandir($dir), array('.', '..'));
    foreach ($files as $file) {
        (is_dir("$dir/$file")) ? delTree("$dir/$file") : unlink("$dir/$file");
    }
    return rmdir($dir);
}
`;
async function Ye(t) {
  const e = "wordpress-playground.zip", r = `/tmp/${e}`, s = D({
    zipPath: r,
    documentRoot: await t.documentRoot
  });
  await Pe(
    t,
    `zipDir(${s.documentRoot}, ${s.zipPath});`
  );
  const n = await t.readFileAsBuffer(r);
  return t.unlink(r), new File([n], e);
}
const Ke = async (t, { fullSiteZip: e }) => {
  const r = "/import.zip";
  await t.writeFile(
    r,
    new Uint8Array(await e.arrayBuffer())
  );
  const s = await t.absoluteUrl, n = await t.documentRoot;
  await t.rmdir(n), await q(t, { zipPath: r, extractToPath: "/" });
  const i = D({ absoluteUrl: s });
  await Qe(
    t,
    `${n}/wp-config.php`,
    (o) => `<?php
			if(!defined('WP_HOME')) {
				define('WP_HOME', ${i.absoluteUrl});
				define('WP_SITEURL', ${i.absoluteUrl});
			}
			?>${o}`
  );
}, q = async (t, { zipPath: e, extractToPath: r }) => {
  const s = D({
    zipPath: e,
    extractToPath: r
  });
  await Pe(
    t,
    `unzip(${s.zipPath}, ${s.extractToPath});`
  );
}, Je = async (t, { file: e }) => {
  var _a3;
  const r = await t.request({
    url: "/wp-admin/admin.php?import=wordpress"
  }), s = (_a3 = Q(r).getElementById("import-upload-form")) == null ? void 0 : _a3.getAttribute("action"), n = await t.request({
    url: `/wp-admin/${s}`,
    method: "POST",
    files: { import: e }
  }), i = Q(n).querySelector(
    "#wpbody-content form"
  );
  if (!i)
    throw console.log(n.text), new Error(
      "Could not find an importer form in response. See the response text above for details."
    );
  const o = Ze(i);
  o.fetch_attachments = "1";
  for (const a in o)
    if (a.startsWith("user_map[")) {
      const l = "user_new[" + a.slice(9, -1) + "]";
      o[l] = "1";
    }
  await t.request({
    url: i.action,
    method: "POST",
    formData: o
  });
};
function Q(t) {
  return new DOMParser().parseFromString(t.text, "text/html");
}
function Ze(t) {
  return Object.fromEntries(new FormData(t).entries());
}
async function Qe(t, e, r) {
  await t.writeFile(
    e,
    r(await t.readFileAsText(e))
  );
}
async function Pe(t, e) {
  const r = await t.run({
    code: Z + e
  });
  if (r.exitCode !== 0)
    throw console.log(Z + e), console.log(e + ""), console.log(r.errors), r.errors;
  return r;
}
async function _e(t, { targetPath: e, zipFile: r }) {
  const s = r.name, n = s.replace(/\.zip$/, ""), i = `/tmp/assets/${n}`, o = `/tmp/${s}`, a = () => t.rmdir(i, {
    recursive: true
  });
  await t.fileExists(i) && await a(), await ge(t, {
    path: o,
    data: r
  });
  const l = () => Promise.all([a, () => t.unlink(o)]);
  try {
    await q(t, {
      zipPath: o,
      extractToPath: i
    });
    const c = await t.listFiles(i, {
      prependPath: true
    }), u = c.length === 1 && await t.isDir(c[0]);
    let d, p2 = "";
    u ? (p2 = c[0], d = c[0].split("/").pop()) : (p2 = i, d = n);
    const y = `${e}/${d}`;
    return await t.mv(p2, y), await l(), {
      assetFolderPath: y,
      assetFolderName: d
    };
  } catch (c) {
    throw await l(), c;
  }
}
const Xe = async (t, { pluginZipFile: e, options: r = {} }, s) => {
  const n = e.name.split("/").pop() || "plugin.zip", i = O(n);
  s == null ? void 0 : s.tracker.setCaption(`Installing the ${i} plugin`);
  try {
    const { assetFolderPath: o } = await _e(t, {
      zipFile: e,
      targetPath: `${await t.documentRoot}/wp-content/plugins`
    });
    ("activate" in r ? r.activate : true) && await me(
      t,
      {
        pluginPath: o,
        pluginName: i
      },
      s
    ), await et(t);
  } catch (o) {
    console.error(
      `Proceeding without the ${i} plugin. Could not install it in wp-admin. The original error was: ${o}`
    ), console.error(o);
  }
};
async function et(t) {
  await t.isDir("/wordpress/wp-content/plugins/gutenberg") && !await t.fileExists("/wordpress/.gutenberg-patched") && (await t.writeFile("/wordpress/.gutenberg-patched", "1"), await X(
    t,
    "/wordpress/wp-content/plugins/gutenberg/build/block-editor/index.js",
    (e) => e.replace(
      /srcDoc:("[^"]+"|[^,]+)/g,
      'src:"/wp-includes/empty.html"'
    )
  ), await X(
    t,
    "/wordpress/wp-content/plugins/gutenberg/build/block-editor/index.min.js",
    (e) => e.replace(
      /srcDoc:("[^"]+"|[^,]+)/g,
      'src:"/wp-includes/empty.html"'
    )
  ));
}
async function X(t, e, r) {
  return await t.writeFile(
    e,
    r(await t.readFileAsText(e))
  );
}
const tt = async (t, { themeZipFile: e, options: r = {} }, s) => {
  const n = O(e.name);
  s == null ? void 0 : s.tracker.setCaption(`Installing the ${n} theme`);
  try {
    const { assetFolderName: i } = await _e(t, {
      zipFile: e,
      targetPath: `${await t.documentRoot}/wp-content/themes`
    });
    ("activate" in r ? r.activate : true) && await we(
      t,
      {
        themeFolderName: i
      },
      s
    );
  } catch (i) {
    console.error(
      `Proceeding without the ${n} theme. Could not install it in wp-admin. The original error was: ${i}`
    ), console.error(i);
  }
}, rt = async (t, { username: e = "admin", password: r = "password" } = {}, s) => {
  s == null ? void 0 : s.tracker.setCaption((s == null ? void 0 : s.initialCaption) || "Logging in"), await t.request({
    url: "/wp-login.php"
  }), await t.request({
    url: "/wp-login.php",
    method: "POST",
    formData: {
      log: e,
      pwd: r,
      rememberme: "forever"
    }
  });
}, st = async (t, { options: e }) => {
  await t.request({
    url: "/wp-admin/install.php?step=2",
    method: "POST",
    formData: {
      language: "en",
      prefix: "wp_",
      weblog_title: "My WordPress Website",
      user_name: e.adminPassword || "admin",
      admin_password: e.adminPassword || "password",
      admin_password2: e.adminPassword || "password",
      Submit: "Install WordPress",
      pw_weak: "1",
      admin_email: "admin@localhost.com"
    }
  });
}, nt = async (t, { options: e }) => {
  const r = `<?php
	include 'wordpress/wp-load.php';
	$site_options = ${S(e)};
	foreach($site_options as $name => $value) {
		update_option($name, $value);
	}
	echo "Success";
	`, s = await t.run({
    code: r
  });
  return be(s), { code: r, result: s };
}, it = async (t, { meta: e, userId: r }) => {
  const s = `<?php
	include 'wordpress/wp-load.php';
	$meta = ${S(e)};
	foreach($meta as $name => $value) {
		update_user_meta(${S(r)}, $name, $value);
	}
	echo "Success";
	`, n = await t.run({
    code: s
  });
  return be(n), { code: s, result: n };
};
async function be(t) {
  if (t.text !== "Success")
    throw console.log(t), new Error(`Failed to run code: ${t.text} ${t.errors}`);
}
const ot = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  activatePlugin: me,
  activateTheme: we,
  applyWordPressPatches: Ne,
  cp: ze,
  defineSiteUrl: Ve,
  defineWpConfigConsts: z,
  importFile: Je,
  installPlugin: Xe,
  installTheme: tt,
  login: rt,
  mkdir: qe,
  mv: De,
  replaceSite: Ke,
  request: Me,
  rm: je,
  rmdir: Be,
  runPHP: He,
  runPHPWithOptions: We,
  runWpInstallationWizard: st,
  setPhpIniEntry: Ie,
  setSiteOptions: nt,
  unzip: q,
  updateUserMeta: it,
  writeFile: ge,
  zipEntireSite: Ye
}, Symbol.toStringTag, { value: "Module" })), at = 5 * 1024 * 1024;
function ct(t, e) {
  const r = t.headers.get("content-length") || "", s = parseInt(r, 10) || at;
  function n(i, o) {
    e(
      new CustomEvent("progress", {
        detail: {
          loaded: i,
          total: o
        }
      })
    );
  }
  return new Response(
    new ReadableStream({
      async start(i) {
        if (!t.body) {
          i.close();
          return;
        }
        const o = t.body.getReader();
        let a = 0;
        for (; ; )
          try {
            const { done: l, value: c } = await o.read();
            if (c && (a += c.byteLength), l) {
              n(a, a), i.close();
              break;
            } else
              n(a, s), i.enqueue(c);
          } catch (l) {
            console.error({ e: l }), i.error(l);
            break;
          }
      }
    }),
    {
      status: t.status,
      statusText: t.statusText,
      headers: t.headers
    }
  );
}
const U = 1e-5;
class N extends EventTarget {
  constructor({
    weight: e = 1,
    caption: r = "",
    fillTime: s = 4
  } = {}) {
    super(), this._selfWeight = 1, this._selfDone = false, this._selfProgress = 0, this._selfCaption = "", this._isFilling = false, this._subTrackers = [], this._weight = e, this._selfCaption = r, this._fillTime = s;
  }
  stage(e, r = "") {
    if (e || (e = this._selfWeight), this._selfWeight - e < -U)
      throw new Error(
        `Cannot add a stage with weight ${e} as the total weight of registered stages would exceed 1.`
      );
    this._selfWeight -= e;
    const s = new N({
      caption: r,
      weight: e,
      fillTime: this._fillTime
    });
    return this._subTrackers.push(s), s.addEventListener("progress", () => this.notifyProgress()), s.addEventListener("done", () => {
      this.done && this.notifyDone();
    }), s;
  }
  fillSlowly({ stopBeforeFinishing: e = true } = {}) {
    if (this._isFilling)
      return;
    this._isFilling = true;
    const r = 100, s = this._fillTime / r;
    this._fillInterval = setInterval(() => {
      this.set(this._selfProgress + 1), e && this._selfProgress >= 99 && clearInterval(this._fillInterval);
    }, s);
  }
  set(e) {
    this._selfProgress = Math.min(e, 100), this.notifyProgress(), this._selfProgress + U >= 100 && this.finish();
  }
  finish() {
    this._fillInterval && clearInterval(this._fillInterval), this._selfDone = true, this._selfProgress = 100, this._isFilling = false, this._fillInterval = void 0, this.notifyProgress(), this.notifyDone();
  }
  get caption() {
    for (let e = this._subTrackers.length - 1; e >= 0; e--)
      if (!this._subTrackers[e].done) {
        const r = this._subTrackers[e].caption;
        if (r)
          return r;
      }
    return this._selfCaption;
  }
  setCaption(e) {
    this._selfCaption = e, this.notifyProgress();
  }
  get done() {
    return this.progress + U >= 100;
  }
  get progress() {
    if (this._selfDone)
      return 100;
    const e = this._subTrackers.reduce(
      (r, s) => r + s.progress * s.weight,
      this._selfProgress * this._selfWeight
    );
    return Math.round(e * 1e4) / 1e4;
  }
  get weight() {
    return this._weight;
  }
  get observer() {
    return this._progressObserver || (this._progressObserver = (e) => {
      this.set(e);
    }), this._progressObserver;
  }
  get loadingListener() {
    return this._loadingListener || (this._loadingListener = (e) => {
      this.set(e.detail.loaded / e.detail.total * 100);
    }), this._loadingListener;
  }
  pipe(e) {
    e.setProgress({
      progress: this.progress,
      caption: this.caption
    }), this.addEventListener("progress", (r) => {
      e.setProgress({
        progress: r.detail.progress,
        caption: r.detail.caption
      });
    }), this.addEventListener("done", () => {
      e.setLoaded();
    });
  }
  addEventListener(e, r) {
    super.addEventListener(e, r);
  }
  removeEventListener(e, r) {
    super.removeEventListener(e, r);
  }
  notifyProgress() {
    const e = this;
    this.dispatchEvent(
      new CustomEvent("progress", {
        detail: {
          get progress() {
            return e.progress;
          },
          get caption() {
            return e.caption;
          }
        }
      })
    );
  }
  notifyDone() {
    this.dispatchEvent(new CustomEvent("done"));
  }
}
const ee = Symbol("error"), te = Symbol("message");
class j extends Event {
  constructor(e, r = {}) {
    super(e), this[ee] = r.error === void 0 ? null : r.error, this[te] = r.message === void 0 ? "" : r.message;
  }
  get error() {
    return this[ee];
  }
  get message() {
    return this[te];
  }
}
Object.defineProperty(j.prototype, "error", { enumerable: true });
Object.defineProperty(j.prototype, "message", { enumerable: true });
const lt = typeof globalThis.ErrorEvent == "function" ? globalThis.ErrorEvent : j;
class ut extends EventTarget {
  constructor() {
    super(...arguments), this.listenersCount = 0;
  }
  addEventListener(e, r) {
    ++this.listenersCount, super.addEventListener(e, r);
  }
  removeEventListener(e, r) {
    --this.listenersCount, super.removeEventListener(e, r);
  }
  hasListeners() {
    return this.listenersCount > 0;
  }
}
function ht(t) {
  t.asm = {
    ...t.asm
  };
  const e = new ut();
  for (const r in t.asm)
    if (typeof t.asm[r] == "function") {
      const s = t.asm[r];
      t.asm[r] = function(...n) {
        var _a3;
        try {
          return s(...n);
        } catch (i) {
          if (!(i instanceof Error))
            throw i;
          if ("exitCode" in i && (i == null ? void 0 : i.exitCode) === 0)
            return;
          const o = pt(
            i,
            (_a3 = t.lastAsyncifyStackSource) == null ? void 0 : _a3.stack
          );
          if (t.lastAsyncifyStackSource && (i.cause = t.lastAsyncifyStackSource), !e.hasListeners())
            throw wt(o), i;
          e.dispatchEvent(
            new lt("error", {
              error: i,
              message: o
            })
          );
        }
      };
    }
  return e;
}
let W = [];
function dt() {
  return W;
}
function pt(t, e) {
  if (t.message === "unreachable") {
    let r = ft;
    e || (r += `

This stack trace is lacking. For a better one initialize 
the PHP runtime with { debug: true }, e.g. PHPNode.load('8.1', { debug: true }).

`), W = gt(
      e || t.stack || ""
    );
    for (const s of W)
      r += `    * ${s}
`;
    return r;
  }
  return t.message;
}
const ft = `
"unreachable" WASM instruction executed.

The typical reason is a PHP function missing from the ASYNCIFY_ONLY
list when building PHP.wasm.

You will need to file a new issue in the WordPress Playground repository
and paste this error message there:

https://github.com/WordPress/wordpress-playground/issues/new

If you're a core developer, the typical fix is to:

* Isolate a minimal reproduction of the error
* Add a reproduction of the error to php-asyncify.spec.ts in the WordPress Playground repository
* Run 'npm run fix-asyncify'
* Commit the changes, push to the repo, release updated NPM packages

Below is a list of all the PHP functions found in the stack trace to
help with the minimal reproduction. If they're all already listed in
the Dockerfile, you'll need to trigger this error again with long stack
traces enabled. In node.js, you can do it using the --stack-trace-limit=100
CLI option: 

`, re = "\x1B[41m", mt = "\x1B[1m", se = "\x1B[0m", ne = "\x1B[K";
let ie = false;
function wt(t) {
  if (!ie) {
    ie = true, console.log(`${re}
${ne}
${mt}  WASM ERROR${se}${re}`);
    for (const e of t.split(`
`))
      console.log(`${ne}  ${e} `);
    console.log(`${se}`);
  }
}
function gt(t) {
  try {
    const e = t.split(`
`).slice(1).map((r) => {
      const s = r.trim().substring(3).split(" ");
      return {
        fn: s.length >= 2 ? s[0] : "<unknown>",
        isWasm: r.includes("wasm://")
      };
    }).filter(
      ({ fn: r, isWasm: s }) => s && !r.startsWith("dynCall_") && !r.startsWith("invoke_")
    ).map(({ fn: r }) => r);
    return Array.from(new Set(e));
  } catch {
    return [];
  }
}
class b {
  constructor(e, r, s, n = "", i = 0) {
    this.httpStatusCode = e, this.headers = r, this.bytes = s, this.exitCode = i, this.errors = n;
  }
  static fromRawData(e) {
    return new b(
      e.httpStatusCode,
      e.headers,
      e.bytes,
      e.errors,
      e.exitCode
    );
  }
  toRawData() {
    return {
      headers: this.headers,
      bytes: this.bytes,
      errors: this.errors,
      exitCode: this.exitCode,
      httpStatusCode: this.httpStatusCode
    };
  }
  get json() {
    return JSON.parse(this.text);
  }
  get text() {
    return new TextDecoder().decode(this.bytes);
  }
}
const B = [
  "8.2",
  "8.1",
  "8.0",
  "7.4",
  "7.3",
  "7.2",
  "7.1",
  "7.0",
  "5.6"
], yt = B[0];
class Pt {
  constructor(e, r = {}) {
    __privateAdd(this, _s);
    __privateAdd(this, _r);
    __privateAdd(this, _e2, void 0);
    __privateAdd(this, _t2, void 0);
    this.requestHandler = e, __privateSet(this, _e2, {}), __privateSet(this, _t2, {
      handleRedirects: false,
      maxRedirects: 4,
      ...r
    });
  }
  async request(e, r = 0) {
    const s = await this.requestHandler.request({
      ...e,
      headers: {
        ...e.headers,
        cookie: __privateMethod(this, _r, r_fn).call(this)
      }
    });
    if (s.headers["set-cookie"] && __privateMethod(this, _s, s_fn).call(this, s.headers["set-cookie"]), __privateGet(this, _t2).handleRedirects && s.headers.location && r < __privateGet(this, _t2).maxRedirects) {
      const n = new URL(
        s.headers.location[0],
        this.requestHandler.absoluteUrl
      );
      return this.request(
        {
          url: n.toString(),
          method: "GET",
          headers: {}
        },
        r + 1
      );
    }
    return s;
  }
  pathToInternalUrl(e) {
    return this.requestHandler.pathToInternalUrl(e);
  }
  internalUrlToPath(e) {
    return this.requestHandler.internalUrlToPath(e);
  }
  get absoluteUrl() {
    return this.requestHandler.absoluteUrl;
  }
  get documentRoot() {
    return this.requestHandler.documentRoot;
  }
}
_e2 = new WeakMap();
_t2 = new WeakMap();
_s = new WeakSet();
s_fn = function(e) {
  for (const r of e)
    try {
      if (!r.includes("="))
        continue;
      const s = r.indexOf("="), n = r.substring(0, s), i = r.substring(s + 1).split(";")[0];
      __privateGet(this, _e2)[n] = i;
    } catch (s) {
      console.error(s);
    }
};
_r = new WeakSet();
r_fn = function() {
  const e = [];
  for (const r in __privateGet(this, _e2))
    e.push(`${r}=${__privateGet(this, _e2)[r]}`);
  return e.join("; ");
};
const _t = "http://example.com";
function oe(t) {
  return t.toString().substring(t.origin.length);
}
function ae(t, e) {
  return !e || !t.startsWith(e) ? t : t.substring(e.length);
}
function bt(t, e) {
  return !e || t.startsWith(e) ? t : e + t;
}
class $t {
  constructor(e, r = {}) {
    __privateAdd(this, _l);
    __privateAdd(this, _u);
    __privateAdd(this, _h);
    __privateAdd(this, _e3, void 0);
    __privateAdd(this, _t3, void 0);
    __privateAdd(this, _s2, void 0);
    __privateAdd(this, _r2, void 0);
    __privateAdd(this, _i, void 0);
    __privateAdd(this, _n, void 0);
    __privateAdd(this, _o, void 0);
    __privateAdd(this, _a, void 0);
    __privateAdd(this, _c, void 0);
    __privateSet(this, _a, new ye({ concurrency: 1 }));
    const {
      documentRoot: s = "/www/",
      absoluteUrl: n = typeof location == "object" ? location == null ? void 0 : location.href : "",
      isStaticFilePath: i = () => false
    } = r;
    this.php = e, __privateSet(this, _e3, s), __privateSet(this, _c, i);
    const o = new URL(n);
    __privateSet(this, _s2, o.hostname), __privateSet(this, _r2, o.port ? Number(o.port) : o.protocol === "https:" ? 443 : 80), __privateSet(this, _t3, (o.protocol || "").replace(":", ""));
    const a = __privateGet(this, _r2) !== 443 && __privateGet(this, _r2) !== 80;
    __privateSet(this, _i, [
      __privateGet(this, _s2),
      a ? `:${__privateGet(this, _r2)}` : ""
    ].join("")), __privateSet(this, _n, o.pathname.replace(/\/+$/, "")), __privateSet(this, _o, [
      `${__privateGet(this, _t3)}://`,
      __privateGet(this, _i),
      __privateGet(this, _n)
    ].join(""));
  }
  pathToInternalUrl(e) {
    return `${this.absoluteUrl}${e}`;
  }
  internalUrlToPath(e) {
    const r = new URL(e);
    return r.pathname.startsWith(__privateGet(this, _n)) && (r.pathname = r.pathname.slice(__privateGet(this, _n).length)), oe(r);
  }
  get isRequestRunning() {
    return __privateGet(this, _a).running > 0;
  }
  get absoluteUrl() {
    return __privateGet(this, _o);
  }
  get documentRoot() {
    return __privateGet(this, _e3);
  }
  async request(e) {
    const r = e.url.startsWith("http://") || e.url.startsWith("https://"), s = new URL(
      e.url,
      r ? void 0 : _t
    ), n = ae(
      s.pathname,
      __privateGet(this, _n)
    );
    return __privateGet(this, _c).call(this, n) ? __privateMethod(this, _l, l_fn).call(this, n) : await __privateMethod(this, _u, u_fn).call(this, e, s);
  }
}
_e3 = new WeakMap();
_t3 = new WeakMap();
_s2 = new WeakMap();
_r2 = new WeakMap();
_i = new WeakMap();
_n = new WeakMap();
_o = new WeakMap();
_a = new WeakMap();
_c = new WeakMap();
_l = new WeakSet();
l_fn = function(e) {
  const r = `${__privateGet(this, _e3)}${e}`;
  if (!this.php.fileExists(r))
    return new b(
      404,
      {},
      new TextEncoder().encode("404 File not found")
    );
  const s = this.php.readFileAsBuffer(r);
  return new b(
    200,
    {
      "content-length": [`${s.byteLength}`],
      "content-type": [vt(r)],
      "accept-ranges": ["bytes"],
      "cache-control": ["public, max-age=0"]
    },
    s
  );
};
_u = new WeakSet();
u_fn = async function(e, r) {
  var _a3;
  const s = await __privateGet(this, _a).acquire();
  try {
    this.php.addServerGlobalEntry("DOCUMENT_ROOT", __privateGet(this, _e3)), this.php.addServerGlobalEntry(
      "HTTPS",
      __privateGet(this, _o).startsWith("https://") ? "on" : ""
    );
    let n = "GET";
    const i = {
      host: __privateGet(this, _i),
      ...$e(e.headers || {})
    }, o = [];
    if (e.files && Object.keys(e.files).length) {
      n = "POST";
      for (const c in e.files) {
        const u = e.files[c];
        o.push({
          key: c,
          name: u.name,
          type: u.type,
          data: new Uint8Array(await u.arrayBuffer())
        });
      }
      ((_a3 = i["content-type"]) == null ? void 0 : _a3.startsWith("multipart/form-data")) && (e.formData = Et(
        e.body || ""
      ), i["content-type"] = "application/x-www-form-urlencoded", delete e.body);
    }
    let a;
    e.formData !== void 0 ? (n = "POST", i["content-type"] = i["content-type"] || "application/x-www-form-urlencoded", a = new URLSearchParams(
      e.formData
    ).toString()) : a = e.body;
    let l;
    try {
      l = __privateMethod(this, _h, h_fn).call(this, r.pathname);
    } catch {
      return new b(
        404,
        {},
        new TextEncoder().encode("404 File not found")
      );
    }
    return await this.php.run({
      relativeUri: bt(
        oe(r),
        __privateGet(this, _n)
      ),
      protocol: __privateGet(this, _t3),
      method: e.method || n,
      body: a,
      fileInfos: o,
      scriptPath: l,
      headers: i
    });
  } finally {
    s();
  }
};
_h = new WeakSet();
h_fn = function(e) {
  let r = ae(e, __privateGet(this, _n));
  r.includes(".php") ? r = r.split(".php")[0] + ".php" : (r.endsWith("/") || (r += "/"), r.endsWith("index.php") || (r += "index.php"));
  const s = `${__privateGet(this, _e3)}${r}`;
  if (this.php.fileExists(s))
    return s;
  if (!this.php.fileExists(`${__privateGet(this, _e3)}/index.php`))
    throw new Error(`File not found: ${s}`);
  return `${__privateGet(this, _e3)}/index.php`;
};
function Et(t) {
  const e = {}, r = t.match(/--(.*)\r\n/);
  if (!r)
    return e;
  const s = r[1], n = t.split(`--${s}`);
  return n.shift(), n.pop(), n.forEach((i) => {
    const o = i.indexOf(`\r
\r
`), a = i.substring(0, o).trim(), l = i.substring(o + 4).trim(), c = a.match(/name="([^"]+)"/);
    if (c) {
      const u = c[1];
      e[u] = l;
    }
  }), e;
}
function vt(t) {
  switch (t.split(".").pop()) {
    case "css":
      return "text/css";
    case "js":
      return "application/javascript";
    case "png":
      return "image/png";
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    case "gif":
      return "image/gif";
    case "svg":
      return "image/svg+xml";
    case "woff":
      return "font/woff";
    case "woff2":
      return "font/woff2";
    case "ttf":
      return "font/ttf";
    case "otf":
      return "font/otf";
    case "eot":
      return "font/eot";
    case "ico":
      return "image/x-icon";
    case "html":
      return "text/html";
    case "json":
      return "application/json";
    case "xml":
      return "application/xml";
    case "txt":
    case "md":
      return "text/plain";
    default:
      return "application-octet-stream";
  }
}
const ce = {
  0: "No error occurred. System call completed successfully.",
  1: "Argument list too long.",
  2: "Permission denied.",
  3: "Address in use.",
  4: "Address not available.",
  5: "Address family not supported.",
  6: "Resource unavailable, or operation would block.",
  7: "Connection already in progress.",
  8: "Bad file descriptor.",
  9: "Bad message.",
  10: "Device or resource busy.",
  11: "Operation canceled.",
  12: "No child processes.",
  13: "Connection aborted.",
  14: "Connection refused.",
  15: "Connection reset.",
  16: "Resource deadlock would occur.",
  17: "Destination address required.",
  18: "Mathematics argument out of domain of function.",
  19: "Reserved.",
  20: "File exists.",
  21: "Bad address.",
  22: "File too large.",
  23: "Host is unreachable.",
  24: "Identifier removed.",
  25: "Illegal byte sequence.",
  26: "Operation in progress.",
  27: "Interrupted function.",
  28: "Invalid argument.",
  29: "I/O error.",
  30: "Socket is connected.",
  31: "There is a directory under that path.",
  32: "Too many levels of symbolic links.",
  33: "File descriptor value too large.",
  34: "Too many links.",
  35: "Message too large.",
  36: "Reserved.",
  37: "Filename too long.",
  38: "Network is down.",
  39: "Connection aborted by network.",
  40: "Network unreachable.",
  41: "Too many files open in system.",
  42: "No buffer space available.",
  43: "No such device.",
  44: "There is no such file or directory OR the parent directory does not exist.",
  45: "Executable file format error.",
  46: "No locks available.",
  47: "Reserved.",
  48: "Not enough space.",
  49: "No message of the desired type.",
  50: "Protocol not available.",
  51: "No space left on device.",
  52: "Function not supported.",
  53: "The socket is not connected.",
  54: "Not a directory or a symbolic link to a directory.",
  55: "Directory not empty.",
  56: "State not recoverable.",
  57: "Not a socket.",
  58: "Not supported, or operation not supported on socket.",
  59: "Inappropriate I/O control operation.",
  60: "No such device or address.",
  61: "Value too large to be stored in data type.",
  62: "Previous owner died.",
  63: "Operation not permitted.",
  64: "Broken pipe.",
  65: "Protocol error.",
  66: "Protocol not supported.",
  67: "Protocol wrong type for socket.",
  68: "Result too large.",
  69: "Read-only file system.",
  70: "Invalid seek.",
  71: "No such process.",
  72: "Reserved.",
  73: "Connection timed out.",
  74: "Text file busy.",
  75: "Cross-device link.",
  76: "Extension: Capabilities insufficient."
};
function m(t = "") {
  return function(r, s, n) {
    const i = n.value;
    n.value = function(...o) {
      try {
        return i.apply(this, o);
      } catch (a) {
        const l = typeof a == "object" ? a == null ? void 0 : a.errno : null;
        if (l in ce) {
          const c = ce[l], u = typeof o[0] == "string" ? o[0] : null, d = u !== null ? t.replaceAll("{path}", u) : t;
          throw new Error(`${d}: ${c}`, {
            cause: a
          });
        }
        throw a;
      }
    };
  };
}
const St = [];
function Rt(t) {
  return St[t];
}
(function() {
  var _a3;
  return typeof process < "u" && ((_a3 = process.release) == null ? void 0 : _a3.name) === "node" ? "NODE" : typeof window < "u" ? "WEB" : typeof WorkerGlobalScope < "u" && self instanceof WorkerGlobalScope ? "WORKER" : "NODE";
})();
var xt = Object.defineProperty, Tt = Object.getOwnPropertyDescriptor, w = (t, e, r, s) => {
  for (var n = s > 1 ? void 0 : s ? Tt(e, r) : e, i = t.length - 1, o; i >= 0; i--)
    (o = t[i]) && (n = (s ? o(e, r, n) : o(n)) || n);
  return s && n && xt(e, r, n), n;
};
const f = "string", E = "number", h = Symbol("__private__dont__use");
class g {
  constructor(e, r) {
    __privateAdd(this, _n2);
    __privateAdd(this, _o2);
    __privateAdd(this, _a2);
    __privateAdd(this, _c2);
    __privateAdd(this, _l2);
    __privateAdd(this, _u2);
    __privateAdd(this, _h2);
    __privateAdd(this, _d);
    __privateAdd(this, _p);
    __privateAdd(this, _f);
    __privateAdd(this, _m);
    __privateAdd(this, _w);
    __privateAdd(this, _e4, void 0);
    __privateAdd(this, _t4, void 0);
    __privateAdd(this, _s3, void 0);
    __privateAdd(this, _r3, void 0);
    __privateAdd(this, _i2, void 0);
    __privateSet(this, _e4, []), __privateSet(this, _t4, false), __privateSet(this, _s3, null), __privateSet(this, _r3, {}), __privateSet(this, _i2, []), e !== void 0 && this.initializeRuntime(e), r && (this.requestHandler = new Pt(
      new $t(this, r)
    ));
  }
  async onMessage(e) {
    __privateGet(this, _i2).push(e);
  }
  get absoluteUrl() {
    return this.requestHandler.requestHandler.absoluteUrl;
  }
  get documentRoot() {
    return this.requestHandler.requestHandler.documentRoot;
  }
  pathToInternalUrl(e) {
    return this.requestHandler.requestHandler.pathToInternalUrl(e);
  }
  internalUrlToPath(e) {
    return this.requestHandler.requestHandler.internalUrlToPath(
      e
    );
  }
  initializeRuntime(e) {
    if (this[h])
      throw new Error("PHP runtime already initialized.");
    const r = Rt(e);
    if (!r)
      throw new Error("Invalid PHP runtime id.");
    this[h] = r, r.onMessage = (s) => {
      for (const n of __privateGet(this, _i2))
        n(s);
    }, __privateSet(this, _s3, ht(r));
  }
  setPhpIniPath(e) {
    if (__privateGet(this, _t4))
      throw new Error("Cannot set PHP ini path after calling run().");
    this[h].ccall(
      "wasm_set_phpini_path",
      null,
      ["string"],
      [e]
    );
  }
  setPhpIniEntry(e, r) {
    if (__privateGet(this, _t4))
      throw new Error("Cannot set PHP ini entries after calling run().");
    __privateGet(this, _e4).push([e, r]);
  }
  chdir(e) {
    this[h].FS.chdir(e);
  }
  async request(e, r) {
    if (!this.requestHandler)
      throw new Error("No request handler available.");
    return this.requestHandler.request(e, r);
  }
  async run(e) {
    __privateGet(this, _t4) || (__privateMethod(this, _n2, n_fn).call(this), __privateSet(this, _t4, true)), __privateMethod(this, _d, d_fn).call(this, e.scriptPath || ""), __privateMethod(this, _a2, a_fn).call(this, e.relativeUri || ""), __privateMethod(this, _l2, l_fn2).call(this, e.method || "GET");
    const { host: r, ...s } = {
      host: "example.com:443",
      ...$e(e.headers || {})
    };
    if (__privateMethod(this, _c2, c_fn).call(this, r, e.protocol || "http"), __privateMethod(this, _u2, u_fn2).call(this, s), e.body && __privateMethod(this, _h2, h_fn2).call(this, e.body), e.fileInfos)
      for (const n of e.fileInfos)
        __privateMethod(this, _f, f_fn).call(this, n);
    return e.code && __privateMethod(this, _m, m_fn).call(this, " ?>" + e.code), __privateMethod(this, _p, p_fn).call(this), await __privateMethod(this, _w, w_fn).call(this);
  }
  addServerGlobalEntry(e, r) {
    __privateGet(this, _r3)[e] = r;
  }
  mkdir(e) {
    this[h].FS.mkdirTree(e);
  }
  mkdirTree(e) {
    this.mkdir(e);
  }
  readFileAsText(e) {
    return new TextDecoder().decode(this.readFileAsBuffer(e));
  }
  readFileAsBuffer(e) {
    return this[h].FS.readFile(e);
  }
  writeFile(e, r) {
    this[h].FS.writeFile(e, r);
  }
  unlink(e) {
    this[h].FS.unlink(e);
  }
  mv(e, r) {
    this[h].FS.rename(e, r);
  }
  rmdir(e, r = { recursive: true }) {
    (r == null ? void 0 : r.recursive) && this.listFiles(e).forEach((s) => {
      const n = `${e}/${s}`;
      this.isDir(n) ? this.rmdir(n, r) : this.unlink(n);
    }), this[h].FS.rmdir(e);
  }
  listFiles(e, r = { prependPath: false }) {
    if (!this.fileExists(e))
      return [];
    try {
      const s = this[h].FS.readdir(e).filter(
        (n) => n !== "." && n !== ".."
      );
      if (r.prependPath) {
        const n = e.replace(/\/$/, "");
        return s.map((i) => `${n}/${i}`);
      }
      return s;
    } catch (s) {
      return console.error(s, { path: e }), [];
    }
  }
  isDir(e) {
    return this.fileExists(e) ? this[h].FS.isDir(
      this[h].FS.lookupPath(e).node.mode
    ) : false;
  }
  fileExists(e) {
    try {
      return this[h].FS.lookupPath(e), true;
    } catch {
      return false;
    }
  }
}
_e4 = new WeakMap();
_t4 = new WeakMap();
_s3 = new WeakMap();
_r3 = new WeakMap();
_i2 = new WeakMap();
_n2 = new WeakSet();
n_fn = function() {
  if (__privateGet(this, _e4).length > 0) {
    const e = __privateGet(this, _e4).map(([r, s]) => `${r}=${s}`).join(`
`) + `

`;
    this[h].ccall(
      "wasm_set_phpini_entries",
      null,
      [f],
      [e]
    );
  }
  this[h].ccall("php_wasm_init", null, [], []);
};
_o2 = new WeakSet();
o_fn = function() {
  const e = "/tmp/headers.json";
  if (!this.fileExists(e))
    throw new Error(
      "SAPI Error: Could not find response headers file."
    );
  const r = JSON.parse(this.readFileAsText(e)), s = {};
  for (const n of r.headers) {
    if (!n.includes(": "))
      continue;
    const i = n.indexOf(": "), o = n.substring(0, i).toLowerCase(), a = n.substring(i + 2);
    o in s || (s[o] = []), s[o].push(a);
  }
  return {
    headers: s,
    httpStatusCode: r.status
  };
};
_a2 = new WeakSet();
a_fn = function(e) {
  if (this[h].ccall(
    "wasm_set_request_uri",
    null,
    [f],
    [e]
  ), e.includes("?")) {
    const r = e.substring(e.indexOf("?") + 1);
    this[h].ccall(
      "wasm_set_query_string",
      null,
      [f],
      [r]
    );
  }
};
_c2 = new WeakSet();
c_fn = function(e, r) {
  this[h].ccall(
    "wasm_set_request_host",
    null,
    [f],
    [e]
  );
  let s;
  try {
    s = parseInt(new URL(e).port, 10);
  } catch {
  }
  (!s || isNaN(s) || s === 80) && (s = r === "https" ? 443 : 80), this[h].ccall(
    "wasm_set_request_port",
    null,
    [E],
    [s]
  ), (r === "https" || !r && s === 443) && this.addServerGlobalEntry("HTTPS", "on");
};
_l2 = new WeakSet();
l_fn2 = function(e) {
  this[h].ccall(
    "wasm_set_request_method",
    null,
    [f],
    [e]
  );
};
_u2 = new WeakSet();
u_fn2 = function(e) {
  e.cookie && this[h].ccall(
    "wasm_set_cookies",
    null,
    [f],
    [e.cookie]
  ), e["content-type"] && this[h].ccall(
    "wasm_set_content_type",
    null,
    [f],
    [e["content-type"]]
  ), e["content-length"] && this[h].ccall(
    "wasm_set_content_length",
    null,
    [E],
    [parseInt(e["content-length"], 10)]
  );
  for (const r in e) {
    let s = "HTTP_";
    ["content-type", "content-length"].includes(r.toLowerCase()) && (s = ""), this.addServerGlobalEntry(
      `${s}${r.toUpperCase().replace(/-/g, "_")}`,
      e[r]
    );
  }
};
_h2 = new WeakSet();
h_fn2 = function(e) {
  this[h].ccall(
    "wasm_set_request_body",
    null,
    [f],
    [e]
  ), this[h].ccall(
    "wasm_set_content_length",
    null,
    [E],
    [new TextEncoder().encode(e).length]
  );
};
_d = new WeakSet();
d_fn = function(e) {
  this[h].ccall(
    "wasm_set_path_translated",
    null,
    [f],
    [e]
  );
};
_p = new WeakSet();
p_fn = function() {
  for (const e in __privateGet(this, _r3))
    this[h].ccall(
      "wasm_add_SERVER_entry",
      null,
      [f, f],
      [e, __privateGet(this, _r3)[e]]
    );
};
_f = new WeakSet();
f_fn = function(e) {
  const { key: r, name: s, type: n, data: i } = e, o = `/tmp/${Math.random().toFixed(20)}`;
  this.writeFile(o, i);
  const a = 0;
  this[h].ccall(
    "wasm_add_uploaded_file",
    null,
    [f, f, f, f, E, E],
    [r, s, n, o, a, i.byteLength]
  );
};
_m = new WeakSet();
m_fn = function(e) {
  this[h].ccall(
    "wasm_set_php_code",
    null,
    [f],
    [e]
  );
};
_w = new WeakSet();
w_fn = async function() {
  var _a3;
  let e, r;
  try {
    e = await new Promise((i, o) => {
      var _a4;
      r = (l) => {
        const c = new Error("Rethrown");
        c.cause = l.error, c.betterMessage = l.message, o(c);
      }, (_a4 = __privateGet(this, _s3)) == null ? void 0 : _a4.addEventListener(
        "error",
        r
      );
      const a = this[h].ccall(
        "wasm_sapi_handle_request",
        E,
        [],
        []
      );
      return a instanceof Promise ? a.then(i, o) : i(a);
    });
  } catch (i) {
    for (const c in this)
      typeof this[c] == "function" && (this[c] = () => {
        throw new Error(
          "PHP runtime has crashed \u2013 see the earlier error for details."
        );
      });
    this.functionsMaybeMissingFromAsyncify = dt();
    const o = i, a = "betterMessage" in o ? o.betterMessage : o.message, l = new Error(a);
    throw l.cause = o, l;
  } finally {
    (_a3 = __privateGet(this, _s3)) == null ? void 0 : _a3.removeEventListener("error", r), __privateSet(this, _r3, {});
  }
  const { headers: s, httpStatusCode: n } = __privateMethod(this, _o2, o_fn).call(this);
  return new b(
    n,
    s,
    this.readFileAsBuffer("/tmp/stdout"),
    this.readFileAsText("/tmp/stderr"),
    e
  );
};
w([
  m('Could not create directory "{path}"')
], g.prototype, "mkdir", 1);
w([
  m('Could not create directory "{path}"')
], g.prototype, "mkdirTree", 1);
w([
  m('Could not read "{path}"')
], g.prototype, "readFileAsText", 1);
w([
  m('Could not read "{path}"')
], g.prototype, "readFileAsBuffer", 1);
w([
  m('Could not write to "{path}"')
], g.prototype, "writeFile", 1);
w([
  m('Could not unlink "{path}"')
], g.prototype, "unlink", 1);
w([
  m('Could not move "{path}"')
], g.prototype, "mv", 1);
w([
  m('Could not remove directory "{path}"')
], g.prototype, "rmdir", 1);
w([
  m('Could not list files in "{path}"')
], g.prototype, "listFiles", 1);
w([
  m('Could not stat "{path}"')
], g.prototype, "isDir", 1);
w([
  m('Could not stat "{path}"')
], g.prototype, "fileExists", 1);
function $e(t) {
  const e = {};
  for (const r in t)
    e[r.toLowerCase()] = t[r];
  return e;
}
const Ft = [
  "vfs",
  "literal",
  "wordpress.org/themes",
  "wordpress.org/plugins",
  "url"
];
function Ct(t) {
  return t && typeof t == "object" && typeof t.resource == "string" && Ft.includes(t.resource);
}
class $ {
  static create(e, { semaphore: r, progress: s }) {
    let n;
    switch (e.resource) {
      case "vfs":
        n = new kt(e, s);
        break;
      case "literal":
        n = new At(e, s);
        break;
      case "wordpress.org/themes":
        n = new Nt(e, s);
        break;
      case "wordpress.org/plugins":
        n = new Ut(e, s);
        break;
      case "url":
        n = new Ot(e, s);
        break;
      default:
        throw new Error(`Invalid resource: ${e}`);
    }
    return n = new Ht(n), r && (n = new Wt(n, r)), n;
  }
  setPlayground(e) {
    this.playground = e;
  }
  get isAsync() {
    return false;
  }
}
class kt extends $ {
  constructor(e, r) {
    super(), this.resource = e, this.progress = r;
  }
  async resolve() {
    var _a3;
    const e = await this.playground.readFileAsBuffer(
      this.resource.path
    );
    return (_a3 = this.progress) == null ? void 0 : _a3.set(100), new M([e], this.name);
  }
  get name() {
    return this.resource.path.split("/").pop() || "";
  }
}
class At extends $ {
  constructor(e, r) {
    super(), this.resource = e, this.progress = r;
  }
  async resolve() {
    var _a3;
    return (_a3 = this.progress) == null ? void 0 : _a3.set(100), new M([this.resource.contents], this.resource.name);
  }
  get name() {
    return this.resource.name;
  }
}
class V extends $ {
  constructor(e) {
    super(), this.progress = e;
  }
  async resolve() {
    var _a3, _b, _c3;
    (_a3 = this.progress) == null ? void 0 : _a3.setCaption(this.caption);
    const e = this.getURL();
    let r = await fetch(e);
    if (r = await ct(
      r,
      (_c3 = (_b = this.progress) == null ? void 0 : _b.loadingListener) != null ? _c3 : Lt
    ), r.status !== 200)
      throw new Error(`Could not download "${e}"`);
    return new M([await r.blob()], this.name);
  }
  get caption() {
    return `Downloading ${this.name}`;
  }
  get name() {
    try {
      return new URL(this.getURL(), "http://example.com").pathname.split("/").pop();
    } catch {
      return this.getURL();
    }
  }
  get isAsync() {
    return true;
  }
}
const Lt = () => {
};
class Ot extends V {
  constructor(e, r) {
    super(r), this.resource = e;
  }
  getURL() {
    return this.resource.url;
  }
  get caption() {
    var _a3;
    return (_a3 = this.resource.caption) != null ? _a3 : super.caption;
  }
}
let G = "https://playground.wordpress.net/plugin-proxy";
class Nt extends V {
  constructor(e, r) {
    super(r), this.resource = e;
  }
  get name() {
    return O(this.resource.slug);
  }
  getURL() {
    const e = Ee(this.resource.slug);
    return `${G}?theme=` + e;
  }
}
class Ut extends V {
  constructor(e, r) {
    super(r), this.resource = e;
  }
  get name() {
    return O(this.resource.slug);
  }
  getURL() {
    const e = Ee(this.resource.slug);
    return `${G}?plugin=` + e;
  }
}
function Ee(t) {
  return !t || t.endsWith(".zip") ? t : t + ".latest-stable.zip";
}
class ve extends $ {
  constructor(e) {
    super(), this.resource = e;
  }
  async resolve() {
    return this.resource.resolve();
  }
  async setPlayground(e) {
    return this.resource.setPlayground(e);
  }
  get progress() {
    return this.resource.progress;
  }
  set progress(e) {
    this.resource.progress = e;
  }
  get name() {
    return this.resource.name;
  }
  get isAsync() {
    return this.resource.isAsync;
  }
}
class Ht extends ve {
  async resolve() {
    return this.promise || (this.promise = super.resolve()), this.promise;
  }
}
class Wt extends ve {
  constructor(e, r) {
    super(e), this.semaphore = r;
  }
  async resolve() {
    return this.isAsync ? this.semaphore.run(() => super.resolve()) : super.resolve();
  }
}
const It = ["6.2", "6.1", "6.0", "5.9"];
function Mt(t, {
  progress: e = new N(),
  semaphore: r = new ye({ concurrency: 3 }),
  onStepCompleted: s = () => {
  }
} = {}) {
  var _a3, _b;
  const n = (t.steps || []).filter(zt), i = n.reduce(
    (a, l) => {
      var _a4;
      return a + (((_a4 = l.progress) == null ? void 0 : _a4.weight) || 1);
    },
    0
  ), o = n.map(
    (a) => Dt(a, {
      semaphore: r,
      rootProgressTracker: e,
      totalProgressWeight: i
    })
  );
  return {
    versions: {
      php: le(
        (_a3 = t.preferredVersions) == null ? void 0 : _a3.php,
        B,
        yt
      ),
      wp: le(
        (_b = t.preferredVersions) == null ? void 0 : _b.wp,
        It,
        "6.2"
      )
    },
    run: async (a) => {
      try {
        for (const { resources: l } of o)
          for (const c of l)
            c.setPlayground(a), c.isAsync && c.resolve();
        for (const { run: l, step: c } of o) {
          const u = await l(a);
          s(u, c);
        }
        try {
          await a.goTo(
            t.landingPage || "/"
          );
        } catch {
        }
      } finally {
        e.finish();
      }
    }
  };
}
function le(t, e, r) {
  return t && e.includes(t) ? t : r;
}
function zt(t) {
  return !!(typeof t == "object" && t);
}
function Dt(t, {
  semaphore: e,
  rootProgressTracker: r,
  totalProgressWeight: s
}) {
  var _a3;
  const n = r.stage(
    (((_a3 = t.progress) == null ? void 0 : _a3.weight) || 1) / s
  ), i = {};
  for (const u of Object.keys(t)) {
    let d = t[u];
    Ct(d) && (d = $.create(d, {
      semaphore: e
    })), i[u] = d;
  }
  const o = async (u) => {
    var _a4;
    try {
      return n.fillSlowly(), await ot[t.step](
        u,
        await qt(i),
        {
          tracker: n,
          initialCaption: (_a4 = t.progress) == null ? void 0 : _a4.caption
        }
      );
    } finally {
      n.finish();
    }
  }, a = ue(i), l = ue(i).filter(
    (u) => u.isAsync
  ), c = 1 / (l.length + 1);
  for (const u of l)
    u.progress = n.stage(c);
  return { run: o, step: t, resources: a };
}
function ue(t) {
  const e = [];
  for (const r in t) {
    const s = t[r];
    s instanceof $ && e.push(s);
  }
  return e;
}
async function qt(t) {
  const e = {};
  for (const r in t) {
    const s = t[r];
    s instanceof $ ? e[r] = await s.resolve() : e[r] = s;
  }
  return e;
}
async function jt(t, e) {
  await t.run(e);
}
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
const Se = Symbol("Comlink.proxy"), Bt = Symbol("Comlink.endpoint"), Vt = Symbol("Comlink.releaseProxy"), H = Symbol("Comlink.finalizer"), F = Symbol("Comlink.thrown"), Re = (t) => typeof t == "object" && t !== null || typeof t == "function", Gt = {
  canHandle: (t) => Re(t) && t[Se],
  serialize(t) {
    const { port1: e, port2: r } = new MessageChannel();
    return Y(t, e), [r, [r]];
  },
  deserialize(t) {
    return t.start(), K(t);
  }
}, Yt = {
  canHandle: (t) => Re(t) && F in t,
  serialize({ value: t }) {
    let e;
    return t instanceof Error ? e = {
      isError: true,
      value: {
        message: t.message,
        name: t.name,
        stack: t.stack
      }
    } : e = { isError: false, value: t }, [e, []];
  },
  deserialize(t) {
    throw t.isError ? Object.assign(new Error(t.value.message), t.value) : t.value;
  }
}, x = /* @__PURE__ */ new Map([
  ["proxy", Gt],
  ["throw", Yt]
]);
function Kt(t, e) {
  for (const r of t)
    if (e === r || r === "*" || r instanceof RegExp && r.test(e))
      return true;
  return false;
}
function Y(t, e = globalThis, r = ["*"]) {
  e.addEventListener("message", function s(n) {
    if (!n || !n.data)
      return;
    if (!Kt(r, n.origin)) {
      console.warn(`Invalid origin '${n.origin}' for comlink proxy`);
      return;
    }
    const { id: i, type: o, path: a } = Object.assign({ path: [] }, n.data), l = (n.data.argumentList || []).map(_);
    let c;
    try {
      const u = a.slice(0, -1).reduce((p2, y) => p2[y], t), d = a.reduce((p2, y) => p2[y], t);
      switch (o) {
        case "GET":
          c = d;
          break;
        case "SET":
          u[a.slice(-1)[0]] = _(n.data.value), c = true;
          break;
        case "APPLY":
          c = d.apply(u, l);
          break;
        case "CONSTRUCT":
          {
            const p2 = new d(...l);
            c = Ce(p2);
          }
          break;
        case "ENDPOINT":
          {
            const { port1: p2, port2: y } = new MessageChannel();
            Y(t, y), c = er(p2, [p2]);
          }
          break;
        case "RELEASE":
          c = void 0;
          break;
        default:
          return;
      }
    } catch (u) {
      c = { value: u, [F]: 0 };
    }
    Promise.resolve(c).catch((u) => ({ value: u, [F]: 0 })).then((u) => {
      const [d, p2] = L(u);
      e.postMessage(Object.assign(Object.assign({}, d), { id: i }), p2), o === "RELEASE" && (e.removeEventListener("message", s), xe(e), H in t && typeof t[H] == "function" && t[H]());
    }).catch((u) => {
      const [d, p2] = L({
        value: new TypeError("Unserializable return value"),
        [F]: 0
      });
      e.postMessage(Object.assign(Object.assign({}, d), { id: i }), p2);
    });
  }), e.start && e.start();
}
function Jt(t) {
  return t.constructor.name === "MessagePort";
}
function xe(t) {
  Jt(t) && t.close();
}
function K(t, e) {
  return I(t, [], e);
}
function T(t) {
  if (t)
    throw new Error("Proxy has been released and is not useable");
}
function Te(t) {
  return v(t, {
    type: "RELEASE"
  }).then(() => {
    xe(t);
  });
}
const k = /* @__PURE__ */ new WeakMap(), A = "FinalizationRegistry" in globalThis && new FinalizationRegistry((t) => {
  const e = (k.get(t) || 0) - 1;
  k.set(t, e), e === 0 && Te(t);
});
function Zt(t, e) {
  const r = (k.get(e) || 0) + 1;
  k.set(e, r), A && A.register(t, e, t);
}
function Qt(t) {
  A && A.unregister(t);
}
function I(t, e = [], r = function() {
}) {
  let s = false;
  const n = new Proxy(r, {
    get(i, o) {
      if (T(s), o === Vt)
        return () => {
          Qt(n), Te(t), s = true;
        };
      if (o === "then") {
        if (e.length === 0)
          return { then: () => n };
        const a = v(t, {
          type: "GET",
          path: e.map((l) => l.toString())
        }).then(_);
        return a.then.bind(a);
      }
      return I(t, [...e, o]);
    },
    set(i, o, a) {
      T(s);
      const [l, c] = L(a);
      return v(t, {
        type: "SET",
        path: [...e, o].map((u) => u.toString()),
        value: l
      }, c).then(_);
    },
    apply(i, o, a) {
      T(s);
      const l = e[e.length - 1];
      if (l === Bt)
        return v(t, {
          type: "ENDPOINT"
        }).then(_);
      if (l === "bind")
        return I(t, e.slice(0, -1));
      const [c, u] = he(a);
      return v(t, {
        type: "APPLY",
        path: e.map((d) => d.toString()),
        argumentList: c
      }, u).then(_);
    },
    construct(i, o) {
      T(s);
      const [a, l] = he(o);
      return v(t, {
        type: "CONSTRUCT",
        path: e.map((c) => c.toString()),
        argumentList: a
      }, l).then(_);
    }
  });
  return Zt(n, t), n;
}
function Xt(t) {
  return Array.prototype.concat.apply([], t);
}
function he(t) {
  const e = t.map(L);
  return [e.map((r) => r[0]), Xt(e.map((r) => r[1]))];
}
const Fe = /* @__PURE__ */ new WeakMap();
function er(t, e) {
  return Fe.set(t, e), t;
}
function Ce(t) {
  return Object.assign(t, { [Se]: true });
}
function tr(t, e = globalThis, r = "*") {
  return {
    postMessage: (s, n) => t.postMessage(s, r, n),
    addEventListener: e.addEventListener.bind(e),
    removeEventListener: e.removeEventListener.bind(e)
  };
}
function L(t) {
  for (const [e, r] of x)
    if (r.canHandle(t)) {
      const [s, n] = r.serialize(t);
      return [
        {
          type: "HANDLER",
          name: e,
          value: s
        },
        n
      ];
    }
  return [
    {
      type: "RAW",
      value: t
    },
    Fe.get(t) || []
  ];
}
function _(t) {
  switch (t.type) {
    case "HANDLER":
      return x.get(t.name).deserialize(t.value);
    case "RAW":
      return t.value;
  }
}
function v(t, e, r) {
  return new Promise((s) => {
    const n = rr();
    t.addEventListener("message", function i(o) {
      !o.data || !o.data.id || o.data.id !== n || (t.removeEventListener("message", i), s(o.data));
    }), t.start && t.start(), t.postMessage(Object.assign({ id: n }, e), r);
  });
}
function rr() {
  return new Array(4).fill(0).map(() => Math.floor(Math.random() * Number.MAX_SAFE_INTEGER).toString(16)).join("-");
}
function ke(t) {
  nr();
  const e = t instanceof Worker ? t : tr(t), r = K(e), s = Ae(r);
  return new Proxy(s, {
    get: (n, i) => i === "isConnected" ? async () => {
      for (let o = 0; o < 10; o++)
        try {
          await sr(r.isConnected(), 200);
          break;
        } catch {
        }
    } : r[i]
  });
}
async function sr(t, e) {
  return new Promise((r, s) => {
    setTimeout(s, e), t.then(r);
  });
}
let de = false;
function nr() {
  de || (de = true, x.set("EVENT", {
    canHandle: (t) => t instanceof CustomEvent,
    serialize: (t) => [
      {
        detail: t.detail
      },
      []
    ],
    deserialize: (t) => t
  }), x.set("FUNCTION", {
    canHandle: (t) => typeof t == "function",
    serialize(t) {
      console.debug("[Comlink][Performance] Proxying a function");
      const { port1: e, port2: r } = new MessageChannel();
      return Y(t, e), [r, [r]];
    },
    deserialize(t) {
      return t.start(), K(t);
    }
  }), x.set("PHPResponse", {
    canHandle: (t) => typeof t == "object" && t !== null && "headers" in t && "bytes" in t && "errors" in t && "exitCode" in t && "httpStatusCode" in t,
    serialize(t) {
      return [t.toRawData(), []];
    },
    deserialize(t) {
      return b.fromRawData(t);
    }
  }));
}
function Ae(t) {
  return new Proxy(t, {
    get(e, r) {
      switch (typeof e[r]) {
        case "function":
          return (...s) => e[r](...s);
        case "object":
          return e[r] === null ? e[r] : Ae(e[r]);
        case "undefined":
        case "number":
        case "string":
          return e[r];
        default:
          return Ce(e[r]);
      }
    }
  });
}
(function() {
  var _a3;
  return typeof navigator < "u" && ((_a3 = navigator == null ? void 0 : navigator.userAgent) == null ? void 0 : _a3.toLowerCase().indexOf("firefox")) > -1 ? "iframe" : "webworker";
})();
async function ir({
  iframe: t,
  blueprint: e,
  remoteUrl: r,
  progressTracker: s = new N(),
  disableProgressBar: n,
  onBlueprintStepCompleted: i
}) {
  if (or(r), r = fe(r, {
    progressbar: !n
  }), s.setCaption("Preparing WordPress"), !e)
    return pe(t, r, s);
  const o = Mt(e, {
    progress: s.stage(0.5),
    onStepCompleted: i
  }), a = await pe(
    t,
    fe(r, {
      php: o.versions.php,
      wp: o.versions.wp
    }),
    s
  );
  return await jt(o, a), s.finish(), a;
}
async function pe(t, e, r) {
  await new Promise((i) => {
    t.src = e, t.addEventListener("load", i, false);
  });
  const s = ke(
    t.contentWindow
  );
  await s.isConnected(), r.pipe(s);
  const n = r.stage();
  return await s.onDownloadProgress(n.loadingListener), await s.isReady(), n.finish(), s;
}
const C = "https://playground.wordpress.net";
function or(t) {
  const e = new URL(t, C);
  if ((e.origin === C || e.hostname === "localhost") && e.pathname !== "/remote.html")
    throw new Error(
      `Invalid remote URL: ${e}. Expected origin to be ${C}/remote.html.`
    );
}
function fe(t, e) {
  const r = new URL(t, C), s = new URLSearchParams(r.search);
  for (const [n, i] of Object.entries(e))
    i != null && i !== false && s.set(n, i.toString());
  return r.search = s.toString(), r.toString();
}
const scriptRel = "modulepreload";
const seen = {};
const base = "/";
const __vitePreload = function preload(baseModule, deps) {
  if (!deps || deps.length === 0) {
    return baseModule();
  }
  return Promise.all(deps.map((dep) => {
    dep = `${base}${dep}`;
    if (dep in seen)
      return;
    seen[dep] = true;
    const isCss = dep.endsWith(".css");
    const cssSelector = isCss ? '[rel="stylesheet"]' : "";
    if (document.querySelector(`link[href="${dep}"]${cssSelector}`)) {
      return;
    }
    const link = document.createElement("link");
    link.rel = isCss ? "stylesheet" : scriptRel;
    if (!isCss) {
      link.as = "script";
      link.crossOrigin = "";
    }
    link.href = dep;
    document.head.appendChild(link);
    if (isCss) {
      return new Promise((res, rej) => {
        link.addEventListener("load", res);
        link.addEventListener("error", () => rej(new Error(`Unable to preload CSS for ${dep}`)));
      });
    }
  })).then(() => baseModule());
};
/*! Capacitor: https://capacitorjs.com/ - MIT License */
const createCapacitorPlatforms = (win) => {
  const defaultPlatformMap = /* @__PURE__ */ new Map();
  defaultPlatformMap.set("web", { name: "web" });
  const capPlatforms = win.CapacitorPlatforms || {
    currentPlatform: { name: "web" },
    platforms: defaultPlatformMap
  };
  const addPlatform = (name, platform2) => {
    capPlatforms.platforms.set(name, platform2);
  };
  const setPlatform = (name) => {
    if (capPlatforms.platforms.has(name)) {
      capPlatforms.currentPlatform = capPlatforms.platforms.get(name);
    }
  };
  capPlatforms.addPlatform = addPlatform;
  capPlatforms.setPlatform = setPlatform;
  return capPlatforms;
};
const initPlatforms = (win) => win.CapacitorPlatforms = createCapacitorPlatforms(win);
const CapacitorPlatforms = /* @__PURE__ */ initPlatforms(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {});
CapacitorPlatforms.addPlatform;
CapacitorPlatforms.setPlatform;
var ExceptionCode;
(function(ExceptionCode2) {
  ExceptionCode2["Unimplemented"] = "UNIMPLEMENTED";
  ExceptionCode2["Unavailable"] = "UNAVAILABLE";
})(ExceptionCode || (ExceptionCode = {}));
class CapacitorException extends Error {
  constructor(message, code, data) {
    super(message);
    this.message = message;
    this.code = code;
    this.data = data;
  }
}
const getPlatformId = (win) => {
  var _a3, _b;
  if (win === null || win === void 0 ? void 0 : win.androidBridge) {
    return "android";
  } else if ((_b = (_a3 = win === null || win === void 0 ? void 0 : win.webkit) === null || _a3 === void 0 ? void 0 : _a3.messageHandlers) === null || _b === void 0 ? void 0 : _b.bridge) {
    return "ios";
  } else {
    return "web";
  }
};
const createCapacitor = (win) => {
  var _a3, _b, _c3, _d2, _e5;
  const capCustomPlatform = win.CapacitorCustomPlatform || null;
  const cap = win.Capacitor || {};
  const Plugins = cap.Plugins = cap.Plugins || {};
  const capPlatforms = win.CapacitorPlatforms;
  const defaultGetPlatform = () => {
    return capCustomPlatform !== null ? capCustomPlatform.name : getPlatformId(win);
  };
  const getPlatform = ((_a3 = capPlatforms === null || capPlatforms === void 0 ? void 0 : capPlatforms.currentPlatform) === null || _a3 === void 0 ? void 0 : _a3.getPlatform) || defaultGetPlatform;
  const defaultIsNativePlatform = () => getPlatform() !== "web";
  const isNativePlatform = ((_b = capPlatforms === null || capPlatforms === void 0 ? void 0 : capPlatforms.currentPlatform) === null || _b === void 0 ? void 0 : _b.isNativePlatform) || defaultIsNativePlatform;
  const defaultIsPluginAvailable = (pluginName) => {
    const plugin2 = registeredPlugins.get(pluginName);
    if (plugin2 === null || plugin2 === void 0 ? void 0 : plugin2.platforms.has(getPlatform())) {
      return true;
    }
    if (getPluginHeader(pluginName)) {
      return true;
    }
    return false;
  };
  const isPluginAvailable = ((_c3 = capPlatforms === null || capPlatforms === void 0 ? void 0 : capPlatforms.currentPlatform) === null || _c3 === void 0 ? void 0 : _c3.isPluginAvailable) || defaultIsPluginAvailable;
  const defaultGetPluginHeader = (pluginName) => {
    var _a4;
    return (_a4 = cap.PluginHeaders) === null || _a4 === void 0 ? void 0 : _a4.find((h2) => h2.name === pluginName);
  };
  const getPluginHeader = ((_d2 = capPlatforms === null || capPlatforms === void 0 ? void 0 : capPlatforms.currentPlatform) === null || _d2 === void 0 ? void 0 : _d2.getPluginHeader) || defaultGetPluginHeader;
  const handleError = (err) => win.console.error(err);
  const pluginMethodNoop = (_target, prop, pluginName) => {
    return Promise.reject(`${pluginName} does not have an implementation of "${prop}".`);
  };
  const registeredPlugins = /* @__PURE__ */ new Map();
  const defaultRegisterPlugin = (pluginName, jsImplementations = {}) => {
    const registeredPlugin = registeredPlugins.get(pluginName);
    if (registeredPlugin) {
      console.warn(`Capacitor plugin "${pluginName}" already registered. Cannot register plugins twice.`);
      return registeredPlugin.proxy;
    }
    const platform2 = getPlatform();
    const pluginHeader = getPluginHeader(pluginName);
    let jsImplementation;
    const loadPluginImplementation = async () => {
      if (!jsImplementation && platform2 in jsImplementations) {
        jsImplementation = typeof jsImplementations[platform2] === "function" ? jsImplementation = await jsImplementations[platform2]() : jsImplementation = jsImplementations[platform2];
      } else if (capCustomPlatform !== null && !jsImplementation && "web" in jsImplementations) {
        jsImplementation = typeof jsImplementations["web"] === "function" ? jsImplementation = await jsImplementations["web"]() : jsImplementation = jsImplementations["web"];
      }
      return jsImplementation;
    };
    const createPluginMethod = (impl, prop) => {
      var _a4, _b2;
      if (pluginHeader) {
        const methodHeader = pluginHeader === null || pluginHeader === void 0 ? void 0 : pluginHeader.methods.find((m2) => prop === m2.name);
        if (methodHeader) {
          if (methodHeader.rtype === "promise") {
            return (options) => cap.nativePromise(pluginName, prop.toString(), options);
          } else {
            return (options, callback) => cap.nativeCallback(pluginName, prop.toString(), options, callback);
          }
        } else if (impl) {
          return (_a4 = impl[prop]) === null || _a4 === void 0 ? void 0 : _a4.bind(impl);
        }
      } else if (impl) {
        return (_b2 = impl[prop]) === null || _b2 === void 0 ? void 0 : _b2.bind(impl);
      } else {
        throw new CapacitorException(`"${pluginName}" plugin is not implemented on ${platform2}`, ExceptionCode.Unimplemented);
      }
    };
    const createPluginMethodWrapper = (prop) => {
      let remove;
      const wrapper = (...args) => {
        const p2 = loadPluginImplementation().then((impl) => {
          const fn = createPluginMethod(impl, prop);
          if (fn) {
            const p3 = fn(...args);
            remove = p3 === null || p3 === void 0 ? void 0 : p3.remove;
            return p3;
          } else {
            throw new CapacitorException(`"${pluginName}.${prop}()" is not implemented on ${platform2}`, ExceptionCode.Unimplemented);
          }
        });
        if (prop === "addListener") {
          p2.remove = async () => remove();
        }
        return p2;
      };
      wrapper.toString = () => `${prop.toString()}() { [capacitor code] }`;
      Object.defineProperty(wrapper, "name", {
        value: prop,
        writable: false,
        configurable: false
      });
      return wrapper;
    };
    const addListener = createPluginMethodWrapper("addListener");
    const removeListener = createPluginMethodWrapper("removeListener");
    const addListenerNative = (eventName, callback) => {
      const call = addListener({ eventName }, callback);
      const remove = async () => {
        const callbackId = await call;
        removeListener({
          eventName,
          callbackId
        }, callback);
      };
      const p2 = new Promise((resolve) => call.then(() => resolve({ remove })));
      p2.remove = async () => {
        console.warn(`Using addListener() without 'await' is deprecated.`);
        await remove();
      };
      return p2;
    };
    const proxy = new Proxy({}, {
      get(_2, prop) {
        switch (prop) {
          case "$$typeof":
            return void 0;
          case "toJSON":
            return () => ({});
          case "addListener":
            return pluginHeader ? addListenerNative : addListener;
          case "removeListener":
            return removeListener;
          default:
            return createPluginMethodWrapper(prop);
        }
      }
    });
    Plugins[pluginName] = proxy;
    registeredPlugins.set(pluginName, {
      name: pluginName,
      proxy,
      platforms: /* @__PURE__ */ new Set([
        ...Object.keys(jsImplementations),
        ...pluginHeader ? [platform2] : []
      ])
    });
    return proxy;
  };
  const registerPlugin2 = ((_e5 = capPlatforms === null || capPlatforms === void 0 ? void 0 : capPlatforms.currentPlatform) === null || _e5 === void 0 ? void 0 : _e5.registerPlugin) || defaultRegisterPlugin;
  if (!cap.convertFileSrc) {
    cap.convertFileSrc = (filePath) => filePath;
  }
  cap.getPlatform = getPlatform;
  cap.handleError = handleError;
  cap.isNativePlatform = isNativePlatform;
  cap.isPluginAvailable = isPluginAvailable;
  cap.pluginMethodNoop = pluginMethodNoop;
  cap.registerPlugin = registerPlugin2;
  cap.Exception = CapacitorException;
  cap.DEBUG = !!cap.DEBUG;
  cap.isLoggingEnabled = !!cap.isLoggingEnabled;
  cap.platform = cap.getPlatform();
  cap.isNative = cap.isNativePlatform();
  return cap;
};
const initCapacitorGlobal = (win) => win.Capacitor = createCapacitor(win);
const Capacitor$1 = /* @__PURE__ */ initCapacitorGlobal(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {});
const registerPlugin = Capacitor$1.registerPlugin;
Capacitor$1.Plugins;
class WebPlugin {
  constructor(config) {
    this.listeners = {};
    this.windowListeners = {};
    if (config) {
      console.warn(`Capacitor WebPlugin "${config.name}" config object was deprecated in v3 and will be removed in v4.`);
      this.config = config;
    }
  }
  addListener(eventName, listenerFunc) {
    const listeners = this.listeners[eventName];
    if (!listeners) {
      this.listeners[eventName] = [];
    }
    this.listeners[eventName].push(listenerFunc);
    const windowListener = this.windowListeners[eventName];
    if (windowListener && !windowListener.registered) {
      this.addWindowListener(windowListener);
    }
    const remove = async () => this.removeListener(eventName, listenerFunc);
    const p2 = Promise.resolve({ remove });
    Object.defineProperty(p2, "remove", {
      value: async () => {
        console.warn(`Using addListener() without 'await' is deprecated.`);
        await remove();
      }
    });
    return p2;
  }
  async removeAllListeners() {
    this.listeners = {};
    for (const listener in this.windowListeners) {
      this.removeWindowListener(this.windowListeners[listener]);
    }
    this.windowListeners = {};
  }
  notifyListeners(eventName, data) {
    const listeners = this.listeners[eventName];
    if (listeners) {
      listeners.forEach((listener) => listener(data));
    }
  }
  hasListeners(eventName) {
    return !!this.listeners[eventName].length;
  }
  registerWindowListener(windowEventName, pluginEventName) {
    this.windowListeners[pluginEventName] = {
      registered: false,
      windowEventName,
      pluginEventName,
      handler: (event) => {
        this.notifyListeners(pluginEventName, event);
      }
    };
  }
  unimplemented(msg = "not implemented") {
    return new Capacitor$1.Exception(msg, ExceptionCode.Unimplemented);
  }
  unavailable(msg = "not available") {
    return new Capacitor$1.Exception(msg, ExceptionCode.Unavailable);
  }
  async removeListener(eventName, listenerFunc) {
    const listeners = this.listeners[eventName];
    if (!listeners) {
      return;
    }
    const index = listeners.indexOf(listenerFunc);
    this.listeners[eventName].splice(index, 1);
    if (!this.listeners[eventName].length) {
      this.removeWindowListener(this.windowListeners[eventName]);
    }
  }
  addWindowListener(handle) {
    window.addEventListener(handle.windowEventName, handle.handler);
    handle.registered = true;
  }
  removeWindowListener(handle) {
    if (!handle) {
      return;
    }
    window.removeEventListener(handle.windowEventName, handle.handler);
    handle.registered = false;
  }
}
const encode = (str) => encodeURIComponent(str).replace(/%(2[346B]|5E|60|7C)/g, decodeURIComponent).replace(/[()]/g, escape);
const decode = (str) => str.replace(/(%[\dA-F]{2})+/gi, decodeURIComponent);
class CapacitorCookiesPluginWeb extends WebPlugin {
  async getCookies() {
    const cookies = document.cookie;
    const cookieMap = {};
    cookies.split(";").forEach((cookie) => {
      if (cookie.length <= 0)
        return;
      let [key, value] = cookie.replace(/=/, "CAP_COOKIE").split("CAP_COOKIE");
      key = decode(key).trim();
      value = decode(value).trim();
      cookieMap[key] = value;
    });
    return cookieMap;
  }
  async setCookie(options) {
    try {
      const encodedKey = encode(options.key);
      const encodedValue = encode(options.value);
      const expires = `; expires=${(options.expires || "").replace("expires=", "")}`;
      const path = (options.path || "/").replace("path=", "");
      const domain = options.url != null && options.url.length > 0 ? `domain=${options.url}` : "";
      document.cookie = `${encodedKey}=${encodedValue || ""}${expires}; path=${path}; ${domain};`;
    } catch (error) {
      return Promise.reject(error);
    }
  }
  async deleteCookie(options) {
    try {
      document.cookie = `${options.key}=; Max-Age=0`;
    } catch (error) {
      return Promise.reject(error);
    }
  }
  async clearCookies() {
    try {
      const cookies = document.cookie.split(";") || [];
      for (const cookie of cookies) {
        document.cookie = cookie.replace(/^ +/, "").replace(/=.*/, `=;expires=${new Date().toUTCString()};path=/`);
      }
    } catch (error) {
      return Promise.reject(error);
    }
  }
  async clearAllCookies() {
    try {
      await this.clearCookies();
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
registerPlugin("CapacitorCookies", {
  web: () => new CapacitorCookiesPluginWeb()
});
const readBlobAsBase64 = async (blob) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => {
    const base64String = reader.result;
    resolve(base64String.indexOf(",") >= 0 ? base64String.split(",")[1] : base64String);
  };
  reader.onerror = (error) => reject(error);
  reader.readAsDataURL(blob);
});
const normalizeHttpHeaders = (headers = {}) => {
  const originalKeys = Object.keys(headers);
  const loweredKeys = Object.keys(headers).map((k2) => k2.toLocaleLowerCase());
  const normalized = loweredKeys.reduce((acc, key, index) => {
    acc[key] = headers[originalKeys[index]];
    return acc;
  }, {});
  return normalized;
};
const buildUrlParams = (params, shouldEncode = true) => {
  if (!params)
    return null;
  const output = Object.entries(params).reduce((accumulator, entry) => {
    const [key, value] = entry;
    let encodedValue;
    let item;
    if (Array.isArray(value)) {
      item = "";
      value.forEach((str) => {
        encodedValue = shouldEncode ? encodeURIComponent(str) : str;
        item += `${key}=${encodedValue}&`;
      });
      item.slice(0, -1);
    } else {
      encodedValue = shouldEncode ? encodeURIComponent(value) : value;
      item = `${key}=${encodedValue}`;
    }
    return `${accumulator}&${item}`;
  }, "");
  return output.substr(1);
};
const buildRequestInit = (options, extra = {}) => {
  const output = Object.assign({ method: options.method || "GET", headers: options.headers }, extra);
  const headers = normalizeHttpHeaders(options.headers);
  const type = headers["content-type"] || "";
  if (typeof options.data === "string") {
    output.body = options.data;
  } else if (type.includes("application/x-www-form-urlencoded")) {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(options.data || {})) {
      params.set(key, value);
    }
    output.body = params.toString();
  } else if (type.includes("multipart/form-data")) {
    const form = new FormData();
    if (options.data instanceof FormData) {
      options.data.forEach((value, key) => {
        form.append(key, value);
      });
    } else {
      for (const key of Object.keys(options.data)) {
        form.append(key, options.data[key]);
      }
    }
    output.body = form;
    const headers2 = new Headers(output.headers);
    headers2.delete("content-type");
    output.headers = headers2;
  } else if (type.includes("application/json") || typeof options.data === "object") {
    output.body = JSON.stringify(options.data);
  }
  return output;
};
class CapacitorHttpPluginWeb extends WebPlugin {
  async request(options) {
    const requestInit = buildRequestInit(options, options.webFetchExtra);
    const urlParams = buildUrlParams(options.params, options.shouldEncodeUrlParams);
    const url2 = urlParams ? `${options.url}?${urlParams}` : options.url;
    const response = await fetch(url2, requestInit);
    const contentType = response.headers.get("content-type") || "";
    let { responseType = "text" } = response.ok ? options : {};
    if (contentType.includes("application/json")) {
      responseType = "json";
    }
    let data;
    let blob;
    switch (responseType) {
      case "arraybuffer":
      case "blob":
        blob = await response.blob();
        data = await readBlobAsBase64(blob);
        break;
      case "json":
        data = await response.json();
        break;
      case "document":
      case "text":
      default:
        data = await response.text();
    }
    const headers = {};
    response.headers.forEach((value, key) => {
      headers[key] = value;
    });
    return {
      data,
      headers,
      status: response.status,
      url: response.url
    };
  }
  async get(options) {
    return this.request(Object.assign(Object.assign({}, options), { method: "GET" }));
  }
  async post(options) {
    return this.request(Object.assign(Object.assign({}, options), { method: "POST" }));
  }
  async put(options) {
    return this.request(Object.assign(Object.assign({}, options), { method: "PUT" }));
  }
  async patch(options) {
    return this.request(Object.assign(Object.assign({}, options), { method: "PATCH" }));
  }
  async delete(options) {
    return this.request(Object.assign(Object.assign({}, options), { method: "DELETE" }));
  }
}
registerPlugin("CapacitorHttp", {
  web: () => new CapacitorHttpPluginWeb()
});
var Directory;
(function(Directory2) {
  Directory2["Documents"] = "DOCUMENTS";
  Directory2["Data"] = "DATA";
  Directory2["Library"] = "LIBRARY";
  Directory2["Cache"] = "CACHE";
  Directory2["External"] = "EXTERNAL";
  Directory2["ExternalStorage"] = "EXTERNAL_STORAGE";
})(Directory || (Directory = {}));
var Encoding;
(function(Encoding2) {
  Encoding2["UTF8"] = "utf8";
  Encoding2["ASCII"] = "ascii";
  Encoding2["UTF16"] = "utf16";
})(Encoding || (Encoding = {}));
const Filesystem = registerPlugin("Filesystem", {
  web: () => __vitePreload(() => import("./web.877e540b.js"), true ? [] : void 0).then((m2) => new m2.FilesystemWeb())
});
var Style;
(function(Style2) {
  Style2["Dark"] = "DARK";
  Style2["Light"] = "LIGHT";
  Style2["Default"] = "DEFAULT";
})(Style || (Style = {}));
var Animation;
(function(Animation2) {
  Animation2["None"] = "NONE";
  Animation2["Slide"] = "SLIDE";
  Animation2["Fade"] = "FADE";
})(Animation || (Animation = {}));
const StatusBar = registerPlugin("StatusBar");
var plugin = `<?php

add_action( 'init', function() {
	register_post_type( 'hypernote', array(
		'labels' => array(
			'name' => _x( 'Notes', 'Post type general name', 'hypernotes' ),
			'singular_name' => _x( 'Note', 'Post type singular name', 'hypernotes' ),
			'menu_name' => _x( 'Notes', 'Admin Menu text', 'hypernotes' ),
			'name_admin_bar' => _x( 'Notes', 'Add New on Toolbar', 'hypernotes' ),
			'add_new' => __( 'Add New', 'hypernotes' ),
			'add_new_item' => __( 'Add New Note', 'hypernotes' ),
			'new_item' => __( 'New Note', 'hypernotes' ),
			'edit_item' => __( 'Edit Note', 'hypernotes' ),
			'view_item' => __( 'View Note', 'hypernotes' ),
			'all_items' => __( 'All Notes', 'hypernotes' ),
			'search_items' => __( 'Search Notes', 'hypernotes' ),
			'parent_item_colon' => __( 'Parent Notes:', 'hypernotes' ),
			'not_found' => __( 'No notes found.', 'hypernotes' ),
			'not_found_in_trash' => __( 'No notes found in Trash.', 'hypernotes' ),
			'featured_image' => _x( 'Note Cover Image', 'Overrides the \xE2\u20AC\u0153Featured Image\xE2\u20AC\x9D phrase for this post type. Added in 4.3', 'hypernotes' ),
			'set_featured_image' => _x( 'Set cover image', 'Overrides the \xE2\u20AC\u0153Set featured image\xE2\u20AC\x9D phrase for this post type. Added in 4.3', 'hypernotes' ),
			'remove_featured_image' => _x( 'Remove cover image', 'Overrides the \xE2\u20AC\u0153Remove featured image\xE2\u20AC\x9D phrase for this post type. Added in 4.3', 'hypernotes' ),
			'use_featured_image' => _x( 'Use as cover image', 'Overrides the \xE2\u20AC\u0153Use as featured image\xE2\u20AC\x9D phrase for this post type. Added in 4.3', 'hypernotes' ),
			'archives' => _x( 'Note archives', 'The post type archive label used in nav menus. Default \xE2\u20AC\u0153Post Archives\xE2\u20AC\x9D. Added in 4.4', 'hypernotes' ),
			'insert_into_item' => _x( 'Insert into note', 'Overrides the \xE2\u20AC\u0153Insert into post\xE2\u20AC\x9D/\xE2\u20AC\x9DInsert into page\xE2\u20AC\x9D phrase (used when inserting media into a post). Added in 4.4', 'hypernotes' ),
			'uploaded_to_this_item' => _x( 'Uploaded to this note', 'Overrides the \xE2\u20AC\u0153Uploaded to this post\xE2\u20AC\x9D/\xE2\u20AC\x9DUploaded to this page\xE2\u20AC\x9D phrase (used when viewing media attached to a post). Added in 4.4', 'hypernotes' ),
			'filter_items_list' => _x( 'Filter notes list', 'Screen reader text for the filter links heading on the post type listing screen. Default \xE2\u20AC\u0153Filter posts list\xE2\u20AC\x9D/\xE2\u20AC\x9DFilter pages list\xE2\u20AC\x9D. Added in 4.4', 'hypernotes' ),
			'items_list_navigation' => _x( 'Notes list navigation', 'Screen reader text for the pagination heading on the post type listing screen. Default \xE2\u20AC\u0153Posts list navigation\xE2\u20AC\x9D/\xE2\u20AC\x9DPages list navigation\xE2\u20AC\x9D. Added in 4.4', 'hypernotes' ),
			'items_list' => _x( 'Notes list', 'Screen reader text for the items list heading on the post type listing screen. Default \xE2\u20AC\u0153Posts list\xE2\u20AC\x9D/\xE2\u20AC\x9DPages list\xE2\u20AC\x9D. Added in 4.4', 'hypernotes' )
		),
		'show_ui' => true,
		'supports' => array( 'editor' ),
		'show_in_rest' => true,
		'rewrite' => array( 'slug' => 'hypernote' ),
		'menu_icon' => 'dashicons-format-aside',
	) );

	register_taxonomy( 'hypernote-folder', 'hypernote', array(
		'hierarchical'      => true,
		'labels'            => array(
			'name'              => _x( 'Folders', 'taxonomy general name', 'hypernotes' ),
			'singular_name'     => _x( 'Folder', 'taxonomy singular name', 'hypernotes' ),
			'search_items'      => __( 'Search Folders', 'hypernotes' ),
			'all_items'         => __( 'All Folders', 'hypernotes' ),
			'parent_item'       => __( 'Parent Folder', 'hypernotes' ),
			'parent_item_colon' => __( 'Parent Folder:', 'hypernotes' ),
			'edit_item'         => __( 'Edit Folder', 'hypernotes' ),
			'update_item'       => __( 'Update Folder', 'hypernotes' ),
			'add_new_item'      => __( 'Add New Folder', 'hypernotes' ),
			'new_item_name'     => __( 'New Folder Name', 'hypernotes' ),
			'menu_name'         => __( 'Manage Folders', 'hypernotes' ),
			'view_item'         => __( 'View Folder', 'hypernotes' ),
			'not_found'         => __( 'No folders found', 'hypernotes' ),
		),
		'public'            => false,
		'show_ui'           => true,
		'show_admin_column' => true,
		'show_in_rest'      => true,
	) );
} );

add_filter( 'wp_insert_post_data', function( $post ) {
	if ( $post['post_type'] == 'hypernote' && $post[ 'post_status' ] !== 'trash' ) {
		$post[ 'post_status' ] = 'private';
	};

	return $post;
} );

foreach ( array(
	'load-post.php',
	'load-post-new.php',
) as $tag ) {
	add_action( $tag, function() {
		if ( get_current_screen()->post_type !== 'hypernote' ) {
			return;
		}

		remove_editor_styles();
		remove_theme_support( 'editor-color-palette' );
		remove_theme_support( 'editor-font-sizes' );
		remove_theme_support( 'align-wide' );
		remove_theme_support( 'align-full' );
	}, 99999 );
}

add_filter(
	'block_editor_settings_all',
	static function( $settings ) {
		$settings['styles'][] = array(
			'css' => 'body{margin:20px}',
		);
		return $settings;
	}
);

// Should do nothing except for calling add_submenu_page
class Walker_Add_Submenu_Page extends Walker_Category {
	// Should output no HTML, but instead add a submenu page
	function start_el( &$output, $category, $depth = 0, $args = array(), $id = 0 ) {
		if ( $depth === 0 ) {
			add_menu_page(
				$category->name,
				$category->name,
				'read',
				'edit.php?post_type=hypernote&hypernote-folder=' . $category->slug,
				'',
				'',
				1
			);
		} else {
			add_submenu_page(
				'edit.php?post_type=hypernote&hypernote-folder=' . get_term( $category->parent )->slug,
				$category->name,
				$category->name,
				'read',
				'edit.php?post_type=hypernote&hypernote-folder=' . $category->slug,
				'',
				1
			);
		}
	}
}

add_action( 'admin_menu', function() {
	global $menu, $admin_page_hooks, $_registered_pages, $_parent_pages, $submenu, $_wp_real_parent_file;

	$menu = array();
	$admin_page_hooks = array();
	$_registered_pages = array();
	$_parent_pages = array();
	$submenu = array();
	$_wp_real_parent_file = array();

	add_menu_page(
		'All Notes',
		'All Notes',
		'read',
		'edit.php?post_type=hypernote',
		'',
		'',
		1
	);

	wp_list_categories( array(
		'taxonomy' => 'hypernote-folder',
		'hide_empty' => false,
		'title_li' => '',
		'show_option_none' => 'All Notes',
		'walker' => new Walker_Add_Submenu_Page(),
		'echo' => false,
	) );

	global $platform;

	if ( $platform !== 'web' ) {
		add_menu_page(
			'Manage Folders',
			'Manage Folders',
			'read',
			'edit-tags.php?taxonomy=hypernote-folder&post_type=hypernote',
			'',
			'',
			1
		);
	}
}, PHP_INT_MAX );

add_action( 'wp_before_admin_bar_render', 'my_plugin_remove_all_admin_bar_items' );

function my_plugin_remove_all_admin_bar_items() {
	global $wp_admin_bar;
	
	// Get an array of all the toolbar nodes
	$all_toolbar_nodes = $wp_admin_bar->get_nodes();
	
	// Iterate through all the toolbar nodes and remove each one
	foreach ( $all_toolbar_nodes as $node ) {
		if ( $node->id === 'top-secondary' ) continue;
		$wp_admin_bar->remove_node( $node->id );
	}

	$args = array(
		'id'    => 'my_button',
		'title' => '\u25C0 Back',
		'href'  => '#',
		'meta'  => array( 'class' => 'my-toolbar-page' )
	);
	$wp_admin_bar->add_node( $args );

	$wp_admin_bar->add_node( array(
		'id'    => 'new-note',
		'parent' => 'top-secondary',
		'title' => 'New Note',
		'href'  => 'post-new.php?post_type=hypernote',
	) );
}

add_action( 'admin_print_scripts', function() {
	?>
	<script type="text/javascript">
		const channel = new MessageChannel();
		channel.port1.onmessage = () => {
		document.getElementById( 'wpwrap' ).classList.toggle( 'wp-responsive-open' );
		};
		window.top.postMessage( 'hypernotes', '*', [
		channel.port2
		] );
		// listen for load
		document.addEventListener( 'DOMContentLoaded', function() {
		document.querySelector( '#wp-admin-bar-my_button' ).style.display = 'block';
		document.querySelector( '#wp-admin-bar-my_button' ).style.marginLeft = '10px';
		document.querySelector( '#wp-admin-bar-my_button a' ).addEventListener( 'click', function() {
			document.getElementById( 'wpwrap' ).classList.toggle( 'wp-responsive-open' );
			event.preventDefault();
		} );
		} );
	<\/script>
	<style>
		body {
			width: calc( 100vw - env(safe-area-inset-left) - env(safe-area-inset-right));
			height: calc( 100vh - env(safe-area-inset-bottom) );
			margin-bottom: env(safe-area-inset-bottom);
			margin-left: env(safe-area-inset-left);
			margin-right: env(safe-area-inset-right);
		}
		#wpadminbar li#wp-admin-bar-new-note {
			display: block;
			margin-right: 10px;
		}

		#adminmenu div.wp-menu-name {
			padding-left: 14px;
		}

		.wp-menu-image {
			display: none;
		}
	</style>
	<?php
} );

add_filter( 'parent_file', function( $parent_file ) {
	global $submenu_file;

	if ( isset( $_GET['taxonomy'] ) && $_GET['taxonomy'] === 'hypernote-folder' ) {
		$submenu_file = '';
		return 'edit-tags.php?taxonomy=hypernote-folder&post_type=hypernote';
	}

	if (
		isset( $_GET['post_type'] ) &&
		$_GET['post_type'] === 'hypernote' &&
		isset( $_GET['hypernote-folder'] )
	) {
		$term = get_term_by( 'slug', $_GET['hypernote-folder'], 'hypernote-folder' );
		if ( $term->parent > 0 ) {
			$parent_term = get_term( $term->parent, 'hypernote-folder' );
			$submenu_file = 'edit.php?post_type=hypernote&hypernote-folder=' . $_GET['hypernote-folder'];
			return 'edit.php?post_type=hypernote&hypernote-folder=' . $parent_term->slug;
		}
		$submenu_file = '';
		return 'edit.php?post_type=hypernote&hypernote-folder=' . $_GET['hypernote-folder'];
	}

	return $parent_file;
}, PHP_INT_MAX, 2 );
`;
var actions = "<?php\n\nadd_filter( 'wp_insert_post_data', function( $data ) {\n	if ( $data['post_type'] !== 'hypernote' ) return $data;\n	if ( $data['post_status'] !== 'private' ) return $data;\n	$blocks = parse_blocks( $data['post_content'] );\n\n	$i = 0;\n	$text = '';\n\n	while ( isset( $blocks[ $i ] ) ) {\n		$text = wp_trim_words( $blocks[ $i ]['innerHTML'], 10, '' );\n		$i++;\n\n		if ( $text ) {\n			break;\n		}\n	}\n	if ( ! $text ) return $data;\n	post_message_to_js( json_encode( array(\n		'name' => $data['post_title'],\n		'newName' => $text,\n		'content' => $data['post_content'],\n	) ) );\n	$data['post_title'] = $text;\n	return $data;\n} );\n\nfunction get_taxonomy_hierarchy($term_id) {\n	$taxonomy_titles = [];\n\n	// Get the term by its ID.\n	$term = get_term($term_id);\n\n	if ($term && !is_wp_error($term)) {\n		// Add the term's name to the beginning of the array.\n		array_unshift($taxonomy_titles, $term->name);\n\n		// Get the term's ancestors.\n		$ancestors = get_ancestors($term_id, $term->taxonomy);\n\n		// For each ancestor, get its name and add it to the beginning of the array.\n		foreach ($ancestors as $ancestor_id) {\n			$ancestor = get_term($ancestor_id);\n\n			if ($ancestor && !is_wp_error($ancestor)) {\n				array_unshift($taxonomy_titles, $ancestor->name);\n			}\n		}\n	}\n\n	return $taxonomy_titles;\n}\n\nfunction hypernotes_set_object_terms( $object_id, $terms, $tt_ids, $taxonomy, $append, $old_tt_ids ) {\n	if ( $taxonomy !== 'hypernote-folder' ) return;\n	$post = get_post( $object_id );\n\n	if ( count( $tt_ids ) > 1 ) {\n		remove_action( 'set_object_terms', 'hypernotes_set_object_terms', 10, 6 );\n		wp_set_object_terms( $object_id, (int) $tt_ids[0], $taxonomy );\n		add_action( 'set_object_terms', 'hypernotes_set_object_terms', 10, 6 );\n	}\n\n	post_message_to_js( json_encode( array(\n		'name' => $post->post_title,\n		'newPath' => get_taxonomy_hierarchy( (int) $tt_ids[0] ),\n		'path' => get_taxonomy_hierarchy( (int) $old_tt_ids[0] ),\n	) ) );\n}\n\nadd_action( 'set_object_terms', 'hypernotes_set_object_terms', 10, 6 );\n\nadd_action( 'created_term', function( $term_id, $tt_id, $taxonomy ) {\n	if ( $taxonomy !== 'hypernote-folder' ) return;\n	post_message_to_js( json_encode( array(\n		'newPath' => get_taxonomy_hierarchy( (int) $term_id ),\n	) ) );\n}, 10, 3 );\n\nglobal $_hypernotes_path;\n\nadd_action( 'edited_terms', function( $term_id, $taxonomy ) {\n	if ( $taxonomy !== 'hypernote-folder' ) return;\n	global $_hypernotes_path;\n	$_hypernotes_path = get_taxonomy_hierarchy( (int) $term_id );\n}, 10, 3 );\n\nadd_action( 'edited_term', function( $term_id, $tt_id, $taxonomy ) {\n	if ( $taxonomy !== 'hypernote-folder' ) return;\n	global $_hypernotes_path;\n	post_message_to_js( json_encode( array(\n		'newPath' => get_taxonomy_hierarchy( (int) $term_id ),\n		'path' => $_hypernotes_path,\n	) ) );\n}, 10, 3 );\n";
var insert = "<?php\n\ninclude 'wordpress/wp-load.php';\n\nfunction insert_items($items, $taxonomy, $parent_term_id = 0) {\n    foreach ($items as $item) {\n        if ($item['type'] === 'folder') {\n            // Insert the directory as a term and get the term ID\n            $term_info = wp_insert_term($item['name'], $taxonomy, ['parent' => $parent_term_id]);\n\n            if (!is_wp_error($term_info)) {\n                // If the directory has children, run the function again with the children\n                if (!empty($item['children'])) {\n                    insert_items($item['children'], $taxonomy, $term_info['term_id']);\n                }\n            } else {\n                // Handle the error here\n                echo $term_info->get_error_message();\n            }\n        } elseif ($item['type'] === 'note') {\n            // Insert the note as a post and set the term as its parent\n            $post_id = wp_insert_post([\n				'post_type' => 'hypernote',\n                'post_title'   => $item['title'],\n                'post_content' => $item['content'],\n                'post_status'  => 'private',\n                'post_author'  => 1,\n            ]);\n\n            if (!is_wp_error($post_id)) {\n				wp_set_object_terms($post_id, $parent_term_id, $taxonomy);\n			} else {\n				// Handle the error here\n				echo $post_id->get_error_message();\n			}\n        }\n    }\n}\n\ninsert_items($data, 'hypernote-folder');\nupdate_user_option( 1, 'admin_color', 'modern' );\n";
StatusBar.setStyle({ style: Style.Dark });
const platform = Capacitor.getPlatform();
const url = new URL(window.location);
let port = "3000";
if (url.hostname === "localhost" && url.port) {
  port = url.port;
}
async function load() {
  console.log(await Filesystem.checkPermissions());
  if ((await Filesystem.checkPermissions()).publicStorage === "prompt") {
    const button = document.createElement("button");
    button.textContent = "Request File System Permission";
    button.addEventListener("click", async () => {
      await Filesystem.requestPermissions();
      button.remove();
      load();
    });
    document.body.textContent = "";
    document.body.appendChild(button);
    button.focus();
    return;
  }
  let dir = null;
  try {
    dir = await Filesystem.readdir({
      path: "",
      directory: "ICLOUD"
    });
  } catch (e) {
    if (e.message === "Invalid path") {
      alert("iCloud folder not found. Please sign into iCloud.");
    } else {
      alert(e.message);
    }
    window.location.reload();
    return;
  }
  async function readDirRecursive(dir2, name, children) {
    for (const file of dir2.files) {
      console.log(file, name);
      if (file.type === "directory") {
        if (file.name.startsWith("."))
          continue;
        const item = {
          type: "folder",
          name: file.name,
          children: []
        };
        children.push(item);
        await readDirRecursive(await Filesystem.readdir({
          path: [...name, file.name].join("/"),
          directory: "ICLOUD"
        }), [...name, file.name], item.children);
      } else if (file.name.endsWith(".block.html")) {
        const text = await Filesystem.readFile({
          path: [...name, file.name].join("/"),
          directory: "ICLOUD",
          encoding: Encoding.UTF8
        });
        children.push({
          type: "note",
          content: text.data,
          title: file.name.replace(/\.block\.html$/i, "")
        });
      }
    }
  }
  const d = [];
  try {
    await readDirRecursive(dir, [], d);
  } catch (e) {
    alert(e.message);
    return;
  }
  const data = `<?php $data = json_decode( '${JSON.stringify(d).replace("'", "\\'")}', true ); ?>`;
  let messageChannel = null;
  window.addEventListener("statusTap", function() {
    messageChannel == null ? void 0 : messageChannel.postMessage("open");
  });
  window.addEventListener("message", function(event) {
    if (event.data === "hypernotes") {
      messageChannel = event.ports[0];
    }
  });
  console.log("starting playground...");
  const wp = document.createElement("iframe");
  document.body.textContent = "";
  document.body.appendChild(wp);
  try {
    const client = await ir({
      iframe: wp,
      remoteUrl: `http://localhost:${port}/remote.html`,
      blueprint: {
        landingPage: "/wp-admin/edit.php?post_type=hypernote",
        preferredVersions: {
          php: "8.2",
          wp: "6.2"
        },
        steps: [
          {
            step: "writeFile",
            path: "wordpress/wp-content/mu-plugins/hypernotes.php",
            data: `<?php global $platform; $platform = '${platform}'; ?>${plugin}`
          },
          {
            step: "runPHP",
            code: data + insert
          },
          {
            step: "writeFile",
            path: "wordpress/wp-content/mu-plugins/actions.php",
            data: actions
          },
          {
            step: "login"
          }
        ]
      }
    });
    client.onMessage(async (data2) => {
      const { name, content, newName, newPath, path } = JSON.parse(data2);
      console.log(name, newName, newPath, path);
      try {
        if (newPath) {
          if (path) {
            const file = name ? "/" + name + ".block.html" : "";
            await Filesystem.rename({
              from: path.join("/") + file,
              to: newPath.join("/") + file,
              directory: "ICLOUD"
            });
          } else {
            await Filesystem.mkdir({
              path: newPath.join("/"),
              directory: "ICLOUD",
              recursive: true
            });
          }
        } else {
          await Filesystem.writeFile({
            path: name + ".block.html",
            data: content,
            directory: "ICLOUD",
            encoding: Encoding.UTF8
          });
          await Filesystem.rename({
            from: name + ".block.html",
            to: newName + ".block.html",
            directory: "ICLOUD"
          });
        }
      } catch (e) {
        alert(e.message);
      }
    });
  } catch (e) {
    alert("Failed starting Playground. " + e.message);
    return;
  }
}
load();
export { Encoding as E, WebPlugin as W };
