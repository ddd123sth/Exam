var UnitId = 0;
var pagei = 1;
var pages = 10;
$(function () {
    menu();
})
//加载树
function menu() {
    var setting = {
        data: {
            simpleData:
            {
                enable: true,
                idKey: "id",
                pIdKey: "pid",
                rootPId: ''
            }
        },
        callback:
        {
            beforeClick: zTreeBeforeClick,
            onClick: zTreeOnClick
        },
    };
    $.ajax({
        url: "/QuestionBank/GetZtree",
        type: "get",
        dataType: "json",
        success: function (obj) {
            $.fn.zTree.init($("#treeDemo"), setting, obj);
            fillter($.fn.zTree.init($("#treeDemo"), setting, obj));
        }
    })
}
function zTreeBeforeClick(treeId, treeNode, clickFlag) {
    return true;
}
//树的点击事件
function zTreeOnClick(event, treeId, treeNode) {
    var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
    var sNodes = treeObj.getSelectedNodes();
    if (sNodes.length > 0) {
        var level = sNodes[0].level;
    }
    if (level == 4) {
        $("#form1").show();
    }
    else {
        $("#form1").hide();
    }
    var id = treeNode.id;
    UnitId = id;
    $("#unitid").val(UnitId);
    var a = null;
    $("#files").val(null);
    loadquestion(pagei, pages);
}
//默认展开树的前四级
function fillter(treeObj) {
    //获得树形图对象
    var nodeList = treeObj.getNodes();
    //展开第一个根节点
    for (var i = 0; i < nodeList.length; i++) {
        //设置节点展开第二级节点
        treeObj.expandNode(nodeList[i], true, false, true);
        var nodespan = nodeList[i].children;
        if (nodespan.length > 0) {
            for (var j = 0; j < nodespan.length; j++) {
                //设置节点展开第三级节点
                treeObj.expandNode(nodespan[j], true, false, true);
                //var nodes = nodespan[j].children;
                //if (nodes.length > 0) {
                //    //展开第四级节点
                //    for (var g = 0; g < nodes.length; g++) {
                //        treeObj.expandNode(nodes[g], true, false, true);
                //    }
                //}
            }
        }

    }
}
//加载题目信息
function loadquestion(index,size) {
    $.ajax({
        url: "/QuestionBank/GetQuestion",
        type: "get",
        dataType: "json",
        data: { unitid: UnitId, tp: $("#type").val(), qn: $("#qn").val(), index: index, size: size },
        success: function (obj) {
            $("#question").empty();
            $("#page").empty();
            var a = 1;
            if (obj.Data.length > 0) {
                var str = "";
                str += "<table class='table table-border table-bordered table-hover table-bg table-sort'>"
                str += "<tr style='background-color:#f5fafe;'><th><input id='all' type='checkbox' onchange='Change()' /></th><th>题号</th><th>问题</th><th>题目类型</th><th>A</th><th>B</th><th>C</th><th>D</th><th>答案</th><th>操作</th></tr>"
                for (var i = 0; i < obj.Data.length; i++) {
                    var question = obj.Data[i].Question;
                    if (question.length > 5) {
                        question = question.substring(0, 5) + "...";
                    }
                    str += "<tr>"
                    str += "<td><input name='ck' type='checkbox' value='" + obj.Data[i].Id + "' /></td>"
                    str += "<td>" + a + "</td>"
                    str += "<td style='display:none;'>" + obj.Data[i].Id + "</td>"
                    str += "<td style='display:none;'>" + obj.Data[i].Question + "</td>"
                    str += "<td><a href='#' onclick='look(" + obj.Data[i].Id + "," + obj.Data[i].QuestionType + ",this)'>" + question + "</a></td>"
                    str += "<td>" + (obj.Data[i].QuestionType == 1 ? "单选题" : (obj.Data[i].QuestionType == 2 ? "多选题" : "判断题")) + "</td>"
                    str += "<td>" + obj.Data[i].A + "</td>"
                    str += "<td>" + obj.Data[i].B + "</td>"
                    str += "<td>" + obj.Data[i].C + "</td>"
                    str += "<td>" + obj.Data[i].D + "</td>"

                    if (obj.Data[i].QuestionType == 3) {
                        str += "<td>" + (obj.Data[i].JudgeAnswer == 0 ? "错" : "对") + "</td>"
                    }
                    else {
                        str += "<td>" + obj.Data[i].ChoiceAnswer + "</td>"
                    }
                    str += "<td><a href='#' style='text-decoration:none;' onclick='Upt(" + obj.Data[i].Id + "," + obj.Data[i].QuestionType + ",this)' >编辑</a><a href='#' style='text-decoration:none;margin-left:10px;' onclick='del(" + obj.Data[i].Id + ")'>删除</a></td>"
                    str += "</tr>"
                    a++;
                }
                str += "</table>"
                $("#StudentNum").html(obj.Count)

                $("#question").append(str);
                Fen(obj.Count, index, size);
            }
        }
    })
}
//分页
function Fen(Count, Pageindex, Pagesize) {
    $("#page").empty();
    var str = "";
    var page = Math.ceil(Count / Pagesize);
    str += "共 " + page + " 页"
    str += "&nbsp;&nbsp;&nbsp;&nbsp;"
    str += "第 " + Pageindex + "/" + page + " 页";
    str += "&nbsp;&nbsp;&nbsp;&nbsp;"
    if (Pageindex > 1) {
        str += "<a href='#' onclick='loadquestion(1," + Pagesize + ")'>首页</a>";
        str += "&nbsp;&nbsp;&nbsp;&nbsp;"
        str += "<a href='#' onclick='loadquestion(" + (Pageindex - 1) + "," + Pagesize + ")'>上一页</a>";
        str += "&nbsp;&nbsp;&nbsp;&nbsp;"
    }
    else {
        str += "首页";
        str += "&nbsp;&nbsp;&nbsp;&nbsp;"
        str += "上一页";
        str += "&nbsp;&nbsp;&nbsp;&nbsp;"
    }
    if (Pageindex < page) {
        str += "<a href='#' onclick='loadquestion(" + (Pageindex + 1) + "," + Pagesize + ")'>下一页</a>";
        str += "&nbsp;&nbsp;&nbsp;&nbsp;"
        str += "<a href='#' onclick='loadquestion(" + page + "," + Pagesize + ")'>尾页</a>";
        str += "&nbsp;&nbsp;&nbsp;&nbsp;"
    }
    else {
        str += "下一页";
        str += "&nbsp;&nbsp;&nbsp;&nbsp;"
        str += "尾页";
        str += "&nbsp;&nbsp;&nbsp;&nbsp;"
    }
    str += "每页 " + Pagesize + " 条数据"
    str += "&nbsp;&nbsp;&nbsp;&nbsp;"
    str += "共 " + Count + " 条数据"
    $("#page").append(str);
}
//查看题目信息
function look(id, type, obj) {
    var choice = $(obj).parent().next().next().next().next().next().next().html();
    var d = $(obj).parent().next().next().next().next().next().html();
    var c = $(obj).parent().next().next().next().next().html();
    var b = $(obj).parent().next().next().next().html();
    var a = $(obj).parent().next().next().html();
    var types = $(obj).parent().next().html();
    types = (types == "单选题" ? 1 : (types == "多选题" ? 2 : 3));
    var question = $(obj).parent().prev().html();
    var id = $(obj).parent().prev().prev().html();
    var str = "";
    str += "<table style='line-height:30px;'>"
    str += "<tr style='display:none;'><td>Id</td><td><input type='text' id='id' value='" + id + "' /></td></tr>"
    str += "<tr><td style='text-align:right;'>题目：</td><td><span>" + question + "</span></td></tr>"
    str += "<tr><td style='text-align:right;'>题目类型：</td><td><input name='tp' value='1' type='radio' />单选题<input name='tp' value='2' type='radio' />多选题<input name='tp' value='3' type='radio' />判断题</td></tr>"
    if (type == 3) {
        str += "<tr><td style='text-align:right;'>正确答案：</td><td><input name='pd' value='0' type='radio' />错<input name='pd' value='1' type='radio' />对</td></tr>"
    } else {
        str += "<tr><td style='text-align:right;'>选项A：</td><td><span>" + a + "</span></td></tr>"
        str += "<tr><td style='text-align:right;'>选项B：</td><td><span>" + b + "</span></tr>"
        str += "<tr><td style='text-align:right;'>选项C：</td><td><span>" + c + "</span></td></tr>"
        str += "<tr><td style='text-align:right;'>选项D：</td><td><span>" + d + "</span></td></tr>"
        str += "<tr><td style='text-align:right;'>正确答案：</td><td><span>" + choice + "</span></td></tr>"
    }
    str += "<tr><td style='text-align:right;'></td><td><input type='button' value='关闭' style='background-color:#5eb95e; border: none; border-radius:5px 5px; height:25px; color:white; width:60px;' onclick='Close()' /></td></tr>"
    str += "</table>"
    layer.open({
        type: 1,
        title: "查看题目信息",
        skin: "layui-layer-rim",
        maxmin: true,
        area: ["400px", "400px"],
        content: str
    })
    $("input[name='tp'][value=" + types + "]").attr("checked", true);
    if (types == 3) {
        judge = choice == "对" ? 1 : 0;
        $("input[name='pd'][value='" + judge + "']").attr("checked", true);
    }
    $("input[name='tp']").attr("disabled", true);
    $("input[name='pd']").attr("disabled", true);
}
function Close() {
    layer.closeAll();
}
//修改弹窗
function Upt(id, type, obj) {
    var choice = $(obj).parent().prev().html();
    var d = $(obj).parent().prev().prev().html();
    var c = $(obj).parent().prev().prev().prev().html();
    var b = $(obj).parent().prev().prev().prev().prev().html();
    var a = $(obj).parent().prev().prev().prev().prev().prev().html();
    var types = $(obj).parent().prev().prev().prev().prev().prev().prev().html();
    types = (types == "单选题" ? 1 : (types == "多选题" ? 2 : 3));
    var question = $(obj).parent().prev().prev().prev().prev().prev().prev().prev().prev().html();
    var id = $(obj).parent().prev().prev().prev().prev().prev().prev().prev().prev().prev().html();
    var str = "";
    str += "<table style='font-size:18px;'>"
    str += "<tr style='display:none;'><td style='text-align:right;'>Id</td><td><input type='text' id='id' value='" + id + "' /></td></tr>"
    str += "<tr><td style='text-align:right;'>题目：</td><td><textarea id='name' rows='2' cols='20'>" + question + "</textarea></td></tr>"
    str += "<tr><td style='text-align:right;'>题目类型：</td><td><input name='tp' value='1' type='radio' onchange='cg()' />单选题<input name='tp' value='2' type='radio' onchange='cg()' />多选题<input name='tp' value='3' type='radio' onchange='cg()' />判断题</td></tr>"
    if (type == 3) {
        str += "<tr style='display:none;'><td style='text-align:right;'>选项A：</td><td><textarea id='A' rows='2' cols='20'>" + a + "</textarea></td></tr>"
        str += "<tr style='display:none;'><td style='text-align:right;'>选项B：</td><td><textarea id='B' rows='2' cols='20'>" + b + "</textarea></tr>"
        str += "<tr style='display:none;'><td style='text-align:right;'>选项C：</td><td><textarea id='C' rows='2' cols='20'>" + c + "</textarea></td></tr>"
        str += "<tr style='display:none;'><td style='text-align:right;'>选项D：</td><td><textarea id='D' rows='2' cols='20'>" + d + "</textarea></td></tr>"
        str += "<tr style='display:none;'><td style='text-align:right;'>正确答案：</td><td><input type='text' id='choice' value=" + choice + " /></td></tr>"
        str += "<tr><td style='text-align:right;'>正确答案：</td><td><input name='pd' value='0' type='radio' />错<input name='pd' value='1' type='radio' />对</td></tr>"
    } else {
        str += "<tr><td style='text-align:right;'>选项A：</td><td><textarea id='A' rows='2' cols='20'>" + a + "</textarea></td></tr>"
        str += "<tr><td style='text-align:right;'>选项B：</td><td><textarea id='B' rows='2' cols='20'>" + b + "</textarea></tr>"
        str += "<tr><td style='text-align:right;'>选项C：</td><td><textarea id='C' rows='2' cols='20'>" + c + "</textarea></td></tr>"
        str += "<tr><td style='text-align:right;'>选项D：</td><td><textarea id='D' rows='2' cols='20'>" + d + "</textarea></td></tr>"
        str += "<tr><td style='text-align:right;'>正确答案：</td><td><input type='text' id='choice' value=" + choice + " /></td></tr>"
        str += "<tr style='display:none;'><td style='text-align:right;'>正确答案：</td><td><input name='pd' value='0' type='radio' />错<input name='pd' value='1' type='radio' />对</td></tr>"
    }
    str += "<tr><td style='text-align:right;'><input type='button' style='background-color:#dd514c; border: none; border-radius:5px 5px; height:25px; color:white; width:60px;' value='保存' onclick='Update()' /></td><td><input type='button' value='关闭' style='background-color:#5eb95e; border: none; border-radius:5px 5px; height:25px; color:white; width:60px;' onclick='Close()' /></td></tr>"
    str += "</table>"
    layer.open({
        type: 1,
        title: "修改题目信息",
        skin: "layui-layer-rim",
        maxmin: true,
        area: ["380px", "400px"],
        content: str
    })
    $("input[name='tp'][value=" + types + "]").attr("checked", true);
    if (types == 3) {
        judge = choice == "对" ? 1 : 0;
        $("input[name='pd'][value='" + judge + "']").attr("checked", true);
    }
}
//修改时题目类型的改变事件
function cg() {
    var tp = $("input[name='tp']:checked").val();
    if (tp == 3) {
        $("#A").parent().parent().hide();
        $("#B").parent().parent().hide();
        $("#C").parent().parent().hide();
        $("#D").parent().parent().hide();
        $("#choice").parent().parent().hide();
        $("input[name='pd']").parent().parent().show();
    }
    else {
        $("#A").parent().parent().show();
        $("#B").parent().parent().show();
        $("#C").parent().parent().show();
        $("#D").parent().parent().show();
        $("#choice").parent().parent().show();
        $("input[name='pd']").parent().parent().hide();
    }
}
//删除
function del(id) {
    if (confirm("确定要删除吗？")) {
        $.ajax({
            url: "/QuestionBank/Delete",
            type: "get",
            dataType: "json",
            data: { id: id },
            success: function (obj) {
                if (obj > 0) {
                    layer.msg("删除成功！", { icon: 1, time: 2000 });
                    loadquestion(pagei, pages);
                    layer.closeAll();
                }
                else {
                    layer.msg("删除失败！", { icon: 2, time: 3000 });
                }
            }
        })
    }
}
//修改
function Update() {
    var Id = $("#id").val();
    var Question = $("#name").val();
    var QuestionType = $("input[name='tp']:checked").val();


    if (QuestionType == 3) {
        var A = "";
        var B = "";
        var C = "";
        var D = "";
        var d = $("input[name='pd']:checked").val();
        if (d != 1 && d != 0) {
            layer.msg("请选择答案...", { icon: 3, time: 2000 });
            return;
        }
        var ChoiceAnswer = "";
        var JudgeAnswer = $("input[name='pd']:checked").val();
    }
    else {
        var A = $("#A").val();
        var B = $("#B").val();
        var C = $("#C").val();
        var D = $("#D").val();
        var ChoiceAnswer = $("#choice").val();
        if (A.length == 0 || B.length == 0 || C.length == 0 || D.length == 0) {
            layer.msg("选项不能为空...", { icon: 3, time: 2000 });
            return;
        }
        if (QuestionType == 1) {
            if (ChoiceAnswer.length > 1 || ChoiceAnswer == "对" || ChoiceAnswer == "错") {
                layer.msg("请重新选择答案...", { icon: 3, time: 2000 });
                return;
            }
        }
        else {
            if (ChoiceAnswer.length <= 1) {
                layer.msg("请重新选择答案...", { icon: 3, time: 2000 });
                return;
            }
        }
        var JudgeAnswer = "";
    }
    $.ajax({
        url: "/QuestionBank/Update",
        type: "get",
        dataType: "json",
        data: { Id: Id, Question: Question, QuestionType: QuestionType, A: A, B: B, C: C, D: D, ChoiceAnswer: ChoiceAnswer, JudgeAnswer: JudgeAnswer },
        success: function (obj) {
            if (obj > 0) {
                layer.msg("修改成功！", { icon: 1, time: 2000 });
                loadquestion(pagei, pages);
                layer.closeAll();
            }
            else {
                layer.msg("修改失败！", { icon: 2, time: 2000 });
            }
        }
    })
}
//复选框全选、反选
function Change() {
    var all = document.getElementById("all").checked;
    var ck = document.getElementsByName("ck");
    for (var i = 0; i < ck.length; i++) {
        ck[i].checked = all;
    }
}
//批量删除
function delAll() {
    var id = "";
    $("input[name='ck']:checked").each(function () {
        id = id + $(this).val() + ",";
    })
    id = id.substring(id.length - 1, 0);
    if (id.length == 0) {
        layer.msg("请选择...", { icon: 3, time: 2000 });
        return;
    }
    if (confirm("确定要删除吗？")) {
        $.ajax({
            url: "/QuestionBank/Delete",
            type: "get",
            dataType: "json",
            data: { id: id },
            success: function (obj) {
                if (obj > 0) {
                    layer.msg("删除成功！", { icon: 1, time: 2000 });
                    loadquestion(pagei, pages);
                    layer.closeAll();
                }
                else {
                    layer.msg("删除失败！", { icon: 2, time: 3000 });
                }
            }
        })
    }
}
//单个添加
function addquestion() {
    var str = "";
    str += "<table style='font-size:20px;line-height: 30px;'>"
    str += "<tr>"
    str += "<td style='text-align:right;'>题目：</td>"
    str += "<td><textarea id = 'ques' rows = '2' cols = '20' ></textarea ></td>"
    str += "</tr>" 
    str += "<tr><td style='text-align:right;'>题目类型：</td><td><select id='typ' onchange='tpchange()'><option value='1'>单选题</option><option value='2'>多选题</option><option value='3'>判断题</option></select></td></tr>"
    str += "<tr class='x'><td style='text-align:right;'>A：</td><td><textarea id = 'a' rows = '2' cols = '20' ></textarea ></td></tr>"
    str += "<tr class='x'><td style='text-align:right;'>B：</td><td><textarea id = 'b' rows = '2' cols = '20' ></textarea ></td></tr>"
    str += "<tr class='x'><td style='text-align:right;'>C：</td><td><textarea id = 'c' rows = '2' cols = '20' ></textarea ></td></tr>"
    str += "<tr class='x'><td style='text-align:right;'>D：</td><td><textarea id = 'd' rows = '2' cols = '20' ></textarea ></td></tr>"
    str += "<tr class='x'><td style='text-align:right;'>正确答案：</td><td><input type='text' style='border:1px solid black;height:25px;' id='canswer' /></td></tr>"
    str += "<tr class='p' style='display:none;'><td style='text-align:right;'>正确答案：</td><td><input type='radio' name='apd' value='0' />错<input type='radio' name='apd' value='1' />对</td></tr>"
    str += "<tr><td style='text-align:right;'><input type='button' style='background-color:#dd514c; border:none; border-radius:5px 5px; height:25px; color:white; width:60px;' value='添加' onclick='AddQuestions()' /></td><td><input type='button' value='关闭' style='background-color:#5eb95e; border: none; border-radius:5px 5px; height:25px; color:white; width:60px;' onclick='Close()' /></td></tr>"
    str += "</table>"
    layer.open({
        type: 1,
        skin: "layui-layer-rim",
        title: "添加试题",
        area: ["330px", "380px"],
        maxmin: true,
        content: str
    });
}
//添加时题目类型改变事件
function tpchange() {
    if ($("#typ").val() == 1 || $("#typ").val() == 2) {
        $(".p").hide();
        $(".x").show();
    }
    else {
        $(".p").show();
        $(".x").hide();
    }
}
//单个添加试题
function AddQuestions() {
    var ques = $("#ques").val();
    var tp = $("#typ").val();
    var uid = UnitId;
    var A = "";
    var B = "";
    var C = "";
    var D = "";
    var CA = ""
    var JA = "";
    if (tp == 1 || tp == 2) {
        A = $("#a").val();
        B = $("#b").val();
        C = $("#c").val();
        D = $("#d").val();
        CA = $("#canswer").val();
        JA = "";
        if (tp == 1) {
            if (CA.length > 1) {
                layer.msg("请重新选择答案...", { icon: 3, time: 2000 });
                return;
            }
        }
        else {
            if (CA.length <= 1) {
                layer.msg("请重新选择答案...", { icon: 3, time: 2000 });
                return;
            }
        }
    }
    else {
        A = "";
        B = "";
        C = "";
        D = "";
        CA = "";
        JA = $("input[name='apd']:checked").val();
    }
    var da = {
        Question: ques,
        QuestionType: tp,
        UnitId: uid,
        A: A,
        B: B,
        C: C,
        D: D,
        ChoiceAnswer: CA,
        JudgeAnswer: JA
    };
    $.ajax({
        url: "/QuestionBank/Add",
        type: "post",
        dataType: "json",
        data: da,
        success: function (obj) {
            if (obj > 0) {
                layer.msg("添加成功！", { icon: 1, time: 2000 });
                layer.closeAll();
                loadquestion(pagei, pages);
            }
            else if(obj == -2) {
                alert("题目已存在...")
            }
            else {
                alert("添加失败！")
            }
        }
    })
}
//导出
function exports() {
    $.ajax({
        url: "/QuestionBank/QuestionExport",
        type: "post",
        dataType: "json",
        data: { UnitId: UnitId },
        success: function (obj) {
            if (obj > 0) {
                layer.msg("导出成功！", { icon: 1, time: 2000 });
            }
            else {
                layer.msg("导出失败！", { icon: 2, time: 2000 });
            }
        }
    })
}
//导入
function imports() {
    var form = new FormData($("#form1")[0]);
    form.append("UnitId", $("#unitid").val());
    $.ajax({
        url: "/QuestionBank/Improt",
        type: "post",
        dataType: "json",
        processData: false,
        contentType: false,
        data: form,
        success: function (obj) {
            if (obj != null || obj != "") {
                layer.msg("导入成功" + obj[0] + "条！失败" + obj[1] + "条！", { icon: 1, time: 2000 });
                loadquestion(pagei, pages);
            }
            else {
                layer.msg("导入失败！", { icon: 2, time: 2000 });
            }
        }
    })
}