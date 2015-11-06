//
//  JHSPullToRefreshView.h
//  PTR
//
//  Created by lamo on 14/12/18.
//  Copyright (c) 2014年 juhuasuan. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "JHSPullToRefreshProtocols.h"

@interface JHSPullToRefreshControl : UIControl<JHSPullToRefreshPresenter> {
    BOOL _dragging, _layoutManually;
    UIView<JHSPullToRefreshViewObject> *_view;

    CFTimeInterval _beginDraggingTime, _beginLoadingTime;
}

@property(nonatomic, readonly) BOOL refreshing;
@property(nonatomic, assign) BOOL dragging;
@property(nonatomic, assign) JHSPullToRefreshPosition position;
@property(nonatomic, assign) BOOL alwaysOnTop;
@property(nonatomic, strong) UIView<JHSPullToRefreshViewObject> *view;

/**
 * 如果view实现value方法，直接返回；否则返回0.0
 */
@property(nonatomic, readonly) CGFloat value;

@property(nonatomic, readonly) CFTimeInterval beginDraggingTime;
@property(nonatomic, readonly) CFTimeInterval beginLoadingTime;

/**
 * 是否下拉结束后马上发送actions，默认为NO
 * 值为YES时，动画中只会恢复contentOffset而不会修改contentInset
 */
@property(nonatomic, assign) BOOL sendsActionsImmediately;

/**
 * 是否自动布局，默认值为NO
 * 为NO时，内部会基于KVO等机制自动获取需要的状态:dragging 和 contentOffset；
 * 也可以设为YES，手动调用 scrollViewDidScrolled 和 scrollViewDidEndDragging。
 */
@property(nonatomic, assign) BOOL layoutManually;

- (void)scrollViewDidScrolled;
- (void)scrollViewDidEndDragging;

/**
 * 不提供start接口，因为代码控制的开始下拉刷新不是好的交互方式
 */
- (void)endRefreshing;

- (void)beginRefreshing;

@end
